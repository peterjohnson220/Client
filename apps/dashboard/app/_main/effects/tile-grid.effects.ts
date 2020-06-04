import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { TileType, UserTileDto } from 'libs/models';
import { Tile } from '../models';
import { UserTileToTileMapper } from '../mappers';

import * as fromTileGridActions from '../actions/tile-grid.actions';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.LOADING_TILES),
      switchMap((action: fromTileGridActions.LoadingTiles) =>
        this.dashboardApiService.getUserDashboardTiles(action.includeTilePreviewData).pipe(
          map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos)),
          map((tiles: Tile[]) => this.orderMarketingTiles(tiles)),
          map((tiles: Tile[]) => new fromTileGridActions.LoadingTilesSuccess(tiles)),
          catchError(error => of(new fromTileGridActions.LoadingTilesError(error)))
        )
      )
    );

  @Effect()
  loadTile$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.LOADING_SINGLE_TILE),
      switchMap((action: fromTileGridActions.LoadingSingleTile) =>
        this.dashboardApiService.getUserDashboardTile(action.tileId).pipe(
          map((userTileDtos: UserTileDto) => this.mapToTiles([ userTileDtos ])),
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
          map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos)),
          map((tiles: Tile[]) => new fromTileGridActions.ReorderTilesSuccess(tiles)),
          catchError(error => of(new fromTileGridActions.ReorderTilesError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
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
