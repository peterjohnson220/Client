import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { UserTileDto } from 'libs/models';
import { Tile, TileType } from '../models';
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
          map((tiles: Tile[]) => new fromTileGridActions.LoadingTilesSuccess(tiles)),
          catchError(error => of (new fromTileGridActions.LoadingTilesError(error)))
        )
      )
    );

  @Effect()
  loadTile$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromTileGridActions.LOADING_SINGLE_TILE),
      switchMap((action: fromTileGridActions.LoadingSingleTile) =>
        this.dashboardApiService.getUserDashboardTile(action.tileId).pipe(
          map((userTileDtos: UserTileDto) => this.mapToTiles([userTileDtos])),
          map((tiles: Tile[]) => new fromTileGridActions.LoadingSingleTileSuccess(tiles)),
          catchError(error => of (new fromTileGridActions.LoadingSingleTileError(error)))
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
          catchError(error => of (new fromTileGridActions.ReorderTilesError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}

  mapToTiles(userTileDtos: UserTileDto[]): Tile[] {
    const filteredTiles = userTileDtos
      .map(dt => UserTileToTileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1);
    return filteredTiles;
  }
}
