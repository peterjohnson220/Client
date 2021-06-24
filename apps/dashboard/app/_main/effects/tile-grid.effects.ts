import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { TileType, TileTypes, UserTileDto } from 'libs/models';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import * as fromFeatureFlagRedirectActions from 'libs/state/app-context/actions/feature-flag-redirect.action';
import { PageRedirectUrl } from 'libs/models/url-redirect/page-redirect-url';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import { UrlRedirectHelper } from 'libs/core/helpers/url-redirect-helper';
import { GenericUrlPageMap } from 'libs/core/helpers/models/generic-url-page-map';

import { Tile } from '../models';
import { UserTileToTileMapper } from '../mappers';
import * as fromTileGridActions from '../actions/tile-grid.actions';
import * as fromTileGridReducer from '../reducers';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.LOADING_TILES),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getFeatureFlagUrls),
        (action: fromTileGridActions.LoadingTiles, redirectUrls: PageRedirectUrl[]) => ({action, redirectUrls})
      ),
      switchMap((data: any) =>
        this.dashboardApiService.getUserDashboardTiles(data.action.includeTilePreviewData).pipe(
          map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos)),
          map((tiles: Tile[]) => this.orderMarketingTiles(tiles)),
          map((tiles: Tile[]) => data.redirectUrls.length > 0 ?
            UrlRedirectHelper.applyUrlOverrides<Tile>(tiles, this.generateUrlRedirectMapper(), data.redirectUrls) : tiles),
          map((tiles: Tile[]) => data.redirectUrls.length > 0 ? this.applyPricingProjectUrlRedirects(tiles, data.redirectUrls) : tiles),
          map((tiles: Tile[]) => new fromTileGridActions.LoadingTilesSuccess(tiles)),
          catchError(error => of(new fromTileGridActions.LoadingTilesError(error)))
        )
      )
    );

  // due to the nature of async, LOADING_TILES sometimes triggers before the feature flag redirects are populated. This function will apply the redirects
  // after they have been loaded
  @Effect()
  redirectLinksPopulated: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFeatureFlagRedirectActions.GET_USER_REDIRECT_URLS_SUCCESS, fromTileGridActions.LOADING_TILES_SUCCESS),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getFeatureFlagUrls),
        this.store.select(fromTileGridReducer.getTileGridTiles),
        (action: fromFeatureFlagRedirectActions.GetUserRedirectUrlsSuccess | fromTileGridActions.LoadingTilesSuccess,
         redirectUrls: PageRedirectUrl[], tiles: Tile[]) => ({action, redirectUrls, tiles})
      ),
      switchMap((data: any) => {
        const redirectUrls = data.redirectUrls;
        let tiles = data.tiles;

        if ( redirectUrls.length === 0 || tiles.length === 0) {
          // dashboard has not fully loaded
          return [];
        }

        tiles = UrlRedirectHelper.applyUrlOverrides<Tile>(data.tiles, this.generateUrlRedirectMapper(), data.redirectUrls);
        tiles = this.applyPricingProjectUrlRedirects(tiles, data.redirectUrls);

        return [new fromTileGridActions.ReloadTiles(tiles)];
      })
    );

  @Effect()
  loadTile$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.LOADING_SINGLE_TILE),
      withLatestFrom(
        this.store.select(fromFeatureFlagRedirectReducer.getFeatureFlagUrls),
        (action: fromTileGridActions.LoadingSingleTile, redirectUrls: PageRedirectUrl[]) => ({action, redirectUrls})
      ),
      switchMap((data: any) =>
        this.dashboardApiService.getUserDashboardTile(data.action.tileId).pipe(
          map((userTileDtos: UserTileDto) => this.mapToTiles([ userTileDtos ])),
          map((tiles: Tile[]) => UrlRedirectHelper.applyUrlOverrides<Tile>(tiles, this.generateUrlRedirectMapper(), data.redirectUrls)),
          map((tiles: Tile[]) => this.applyPricingProjectUrlRedirects(tiles, data.redirectUrls)),
          map((tiles: Tile[]) => new fromTileGridActions.LoadingSingleTileSuccess(tiles)),
          catchError(error => of(new fromTileGridActions.LoadingSingleTileError(error)))
        )
      )
    );

  @Effect()
  reorderTiles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.REORDER_TILES),
      switchMap((action: fromTileGridActions.ReorderTiles) =>
        this.dashboardApiService.reorderDashboardTiles(action.payload).pipe(
          // .NET Dashboard.ReArrangeTile only returns OK 200. Reload tiles to update order and avoid errors
          map((tiles: Tile[]) => new fromTileGridActions.ReorderTilesSuccess()),
          catchError(error => of(new fromTileGridActions.ReorderTilesError(error)))
        )
      )
    );

  @Effect()
  reorderTilesSuccess$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.REORDER_TILES_SUCCESS),
      map(() => new fromTileGridActions.LoadingTiles(true))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService,
    private store: Store<fromTileGridReducer.State>
  ) {
  }

  private mapToTiles(userTileDtos: UserTileDto[]): Tile[] {
    const filteredTiles = userTileDtos
      .map(dt => UserTileToTileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1);

    return filteredTiles;
  }

  // FORT-229 Reorder the marketing tiles so they are positioned next to each other without leaving empty space between
  private orderMarketingTiles(tiles: Tile[]): Tile[] {
    const MAX_COLUMN_COUNT = 4;
    const marketingTiles = tiles.filter(t => t.MarketingEnabled === true);
    const reorderedTiles = tiles.filter(t => t.MarketingEnabled !== true);
    const firstSmallTile = marketingTiles.find(t => t.Size === 1);
    const firstLargeTile = marketingTiles.find(t => t.Size === 2);

    if (marketingTiles.length <= 1 ||
      firstSmallTile == null ||
      firstLargeTile == null) {
      return tiles;
    }

    let currentRowColumnCount = this.getLastRowTileCount(reorderedTiles, MAX_COLUMN_COUNT);

    for (let i = 0; i < marketingTiles.length; i++) {
      currentRowColumnCount += marketingTiles[ i ].Size;

      if (currentRowColumnCount === MAX_COLUMN_COUNT) {
        currentRowColumnCount = 0;
      }

      if (currentRowColumnCount > MAX_COLUMN_COUNT) {
        const nextSmallTile = marketingTiles.slice(i + 1).find(t => t.Size === 1);

        if (nextSmallTile) {
          // swap a small tile in place of the current tile to make the tiles fit on the row
          marketingTiles[ marketingTiles.indexOf(nextSmallTile) ] = marketingTiles[ i ];
          marketingTiles[ i ] = nextSmallTile;
          currentRowColumnCount = 0;
        } else {
          const previousSmallTile = marketingTiles.slice().reverse().find(t => t.Size === 1);

          if (previousSmallTile) {
            // no more small tiles ahead of the current tile, so swap the last small tile with the current tile
            marketingTiles[ marketingTiles.indexOf(previousSmallTile) ] = marketingTiles[ i ];
            marketingTiles[ i ] = previousSmallTile;
            currentRowColumnCount = 0;
          }
        }
      }
    }

    reorderedTiles.push(...marketingTiles);

    return reorderedTiles;
  }

  private generateUrlRedirectMapper(): GenericUrlPageMap[] {
    const mapper: GenericUrlPageMap[] = [
      { SourceKey: 'Type', SourceKeyValue: TileTypes.PricingProjects, SourceUrlAttributeName: 'Url', TargetPage: UrlPage.ProjectList },
      { SourceKey: 'Type', SourceKeyValue: TileTypes.Surveys, SourceUrlAttributeName: 'Url', TargetPage: UrlPage.Surveys },
      { SourceKey: 'Type', SourceKeyValue: TileTypes.Structures, SourceUrlAttributeName: 'Url', TargetPage: UrlPage.Structures }
    ];

    return mapper;
  }

  private applyPricingProjectUrlRedirects(inputTiles: Tile[], urlRedirects: PageRedirectUrl[]): Tile[] {
    const tiles = cloneDeep(inputTiles);

    // We are using hashmaps and returning the projectId from .NET to drop this functions running time
    // from O(n^5) to O(n^2).
    const tileMapping = new Map<UrlPage, TileTypes>([
      [UrlPage.PricingProject, TileTypes.PricingProjects]
    ]);

    // this only works if we assume only there is one tile per tileType
    const tileHashmap = new Map<TileTypes, Tile>();

    tiles.forEach(tile => {
      tileHashmap.set(tile.Type, tile);
    });

    urlRedirects.forEach(urlRedirect => {
      if (urlRedirect.RedirectUrl.includes('client')) {
        const tileType = tileMapping.get(urlRedirect.TargetPage);

        if (tileType !== undefined) {
          const updateTile = tileHashmap.get(tileType);

          if (updateTile !== undefined) {
            const tileIndex = tiles.findIndex(x => x.Type === tileType);

            // We assume the TilePreviewData and Url will always be in the 0 index... otherwise the running
            // time would be much larger
            const detailData = updateTile.TilePreviewData[0].DetailData;
            detailData.forEach(data => {
              data.RowData[0].Url = urlRedirect.RedirectUrl + '/' + data.RowData[0].ProjectId;
            });

            tiles[tileIndex] = updateTile;
          }
        }
      }
    });

    return tiles;
  }

  private getLastRowTileCount(nonMarketingTiles, MAX_COLUMN_COUNT) {
    let lastRowTileCount = 0;

    nonMarketingTiles.forEach(tile => {
      lastRowTileCount += tile.Size;

      if (lastRowTileCount === MAX_COLUMN_COUNT) {
        lastRowTileCount = 0;
      }

      if (lastRowTileCount > MAX_COLUMN_COUNT) {
        lastRowTileCount = 2;
      }
    });

    return lastRowTileCount;
  }
}
