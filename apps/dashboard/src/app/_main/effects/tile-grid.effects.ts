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
import { DashboardTile } from 'libs/models';

import * as fromDashboardActions from '../actions/tile-grid.actions';

@Injectable()
export class TileGridEffects {
  @Effect()
  loadTiles$: Observable<Action> = this.actions$
    .ofType(fromDashboardActions.LOADING_TILES)
    .switchMap(() =>
      this.dashboardApiService.getUserDashboardTiles()
        .map((dashboardTiles: DashboardTile[]) => new fromDashboardActions.LoadingTilesSuccess(dashboardTiles))
        .catch(error => of (new fromDashboardActions.LoadingTilesError()))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}
}
