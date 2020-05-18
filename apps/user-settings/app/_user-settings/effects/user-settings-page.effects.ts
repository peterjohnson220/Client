import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { CompanySettingsApiService, DashboardApiService } from 'libs/data/payfactors-api/index';
import { TileType, UserTileDto } from 'libs/models/dashboard';

import * as fromUserSettingsPageActions from '../actions/user-settings-page.actions';
import * as fromUserSettingsReducer from '../reducers';

import { UserTileToTileMapper, PayfactorsApiModelMapper } from '../helpers';
import { UserTile } from '../models';

@Injectable()
export class UserSettingsPageEffects {

  @Effect()
  getUserTiles$ = this.actions$
    .pipe(
      ofType(fromUserSettingsPageActions.GET_USER_TILES),
      switchMap((action: fromUserSettingsPageActions.GetUserTiles) => {
        return this.dashboardApiService.getUserDashboardTiles(false)
          .pipe(
            map((userTileDtos: UserTileDto[]) => this.mapToTiles(userTileDtos)),
            map((tiles: UserTile[]) =>  new fromUserSettingsPageActions.GetUserTilesSuccess(tiles)),
            catchError(() => of(new fromUserSettingsPageActions.GetUserTilesError()))
          );
      })
    );

  @Effect()
  saveDashboardPreferences$ = this.actions$.pipe(
    ofType(fromUserSettingsPageActions.SAVE_DASHBOARD_PREFERENCES),
    withLatestFrom(
      this.store.pipe(
        select(fromUserSettingsReducer.getUserTilesAsync)),
      (action, userTiles) => ({ action, userTiles })
    ),
    switchMap((combined: any) => {
      const request = PayfactorsApiModelMapper.buildSaveDashboardPreferencesRequest(combined.userTiles.obj);
      return this.dashboardApiService.saveDashboardPreferences(request).pipe(
        map(() => new fromUserSettingsPageActions.SaveDashboardPreferencesSuccess()),
        catchError(() => of(new fromUserSettingsPageActions.SaveDashboardPreferencesError()))
      );
    })
  );

  private mapToTiles(userTileDto: UserTileDto[]): UserTile[] {
    return userTileDto
      .map(dt => UserTileToTileMapper.mapUserTileDtoToTile(dt))
      .filter(t => new TileType().AllTypes.indexOf(t.Type) !== -1 && t.MarketingEnabled !== true);
  }

  constructor(
    private actions$: Actions,
    private store: Store<fromUserSettingsReducer.State>,
    private companySettingsApiService: CompanySettingsApiService,
    private dashboardApiService: DashboardApiService
  ) {}
}

