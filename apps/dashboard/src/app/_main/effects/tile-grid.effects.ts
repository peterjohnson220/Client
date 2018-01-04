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
import { UserTileToTileMapper } from '../mappers';

import * as fromTileGridActions from '../actions/tile-grid.actions';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .ofType(fromTileGridActions.LOADING_TILES)
    .switchMap(() =>
      this.dashboardApiService.getUserDashboardTiles()
        .map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos))
        .map((tiles: Tile[]) => new fromTileGridActions.LoadingTilesSuccess(tiles))
        .catch(error => of (new fromTileGridActions.LoadingTilesError(error)))
    );

  @Effect()
  reorderTiles$: Observable<Action> = this.actions$
    .ofType(fromTileGridActions.REORDER_TILES)
    .switchMap((action: fromTileGridActions.ReorderTiles) =>
      this.dashboardApiService.reorderDashboardTiles(action.payload)
        .map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos))
        .map((tiles: Tile[]) => new fromTileGridActions.ReorderTilesSuccess(tiles))
        .catch(error => of (new fromTileGridActions.ReorderTilesError(error)))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}

  mapToTiles(userTileDtos: UserTileDto[]): Tile[] {
    return userTileDtos
      .map(dt => UserTileToTileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1);
  }
}
