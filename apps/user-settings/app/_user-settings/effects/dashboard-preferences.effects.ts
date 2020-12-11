import { Injectable } from '@angular/core';

import orderBy from 'lodash/orderBy';

import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { DashboardApiService } from 'libs/data/payfactors-api/index';
import { TileType, UserTileDto } from 'libs/models/dashboard';

import * as fromDashboardPreferencesActions from '../actions/dashboard-preferences.actions';
import * as fromUserSettingsReducer from '../reducers';

import { UserTileToTileMapper, PayfactorsApiModelMapper } from '../helpers';
import { UserTile } from '../models';

@Injectable()
export class DashboardPreferencesEffects {

  @Effect()
  getUserTiles$ = this.actions$
    .pipe(
      ofType(fromDashboardPreferencesActions.GET_USER_TILES),
      switchMap((action: fromDashboardPreferencesActions.GetUserTiles) => {
        return this.dashboardApiService.getUserDashboardTiles(false)
          .pipe(
            map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos)),
            map((tiles: UserTile[]) =>  new fromDashboardPreferencesActions.GetUserTilesSuccess(tiles)),
            catchError(() => of(new fromDashboardPreferencesActions.GetUserTilesError()))
          );
      })
    );

  @Effect()
  saveDashboardPreferences$ = this.actions$.pipe(
    ofType(fromDashboardPreferencesActions.SAVE_DASHBOARD_PREFERENCES),
    withLatestFrom(
      this.store.pipe(
        select(fromUserSettingsReducer.getUserTilesAsync)),
      (action, userTiles) => ({ action, userTiles })
    ),
    switchMap((combined: any) => {
      const request = PayfactorsApiModelMapper.buildSaveDashboardPreferencesRequest(combined.userTiles.obj);
      return this.dashboardApiService.saveDashboardPreferences(request).pipe(
        map(() => new fromDashboardPreferencesActions.SaveDashboardPreferencesSuccess()),
        catchError(() => of(new fromDashboardPreferencesActions.SaveDashboardPreferencesError()))
      );
    })
  );

  private mapToTiles(userTileDto: UserTileDto[]): UserTile[] {
    return orderBy(userTileDto
      .map(dt => UserTileToTileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1 && t.MarketingEnabled !== true), ['Label'], 'asc');
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromUserSettingsReducer.State>,
    private dashboardApiService: DashboardApiService
  ) {}
}

