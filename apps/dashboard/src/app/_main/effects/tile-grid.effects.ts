import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { UserTileDto } from 'libs/models';
import { Tile, TileType } from '../models';
import { TileMapper } from '../mappers';

import * as fromDashboardActions from '../actions/tile-grid.actions';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .ofType(fromDashboardActions.LOADING_TILES)
    .switchMap((action: fromDashboardActions.LoadingTiles) =>
      this.dashboardApiService.getUserDashboardTiles(action.includeTilePreviewData)
        .map((userTileDtos: UserTileDto[]) => this.mapUserTileDtosToTiles(userTileDtos))
        .map((tiles: Tile[]) => new fromDashboardActions.LoadingTilesSuccess(tiles))
        .catch(error => of (new fromDashboardActions.LoadingTilesError(error)))
    );

  @Effect()
  reorderTiles$: Observable<Action> = this.actions$
    .ofType(fromDashboardActions.REORDER_TILES)
    .switchMap((action: fromDashboardActions.ReorderTiles) =>
      this.dashboardApiService.reorderDashboardTiles(action.payload)
        .map((userTileDtos: UserTileDto[]) => this.mapUserTileDtosToTiles(userTileDtos))
        .map((tiles: Tile[]) => new fromDashboardActions.ReorderTilesSuccess(tiles))
        .catch(error => of (new fromDashboardActions.ReorderTilesError(error)))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}

  mapUserTileDtosToTiles(userTileDtos: UserTileDto[]): Tile[] {
    return userTileDtos
      .map(dt => TileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1);
  }
}
