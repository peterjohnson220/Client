import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DashboardApiService } from 'libs/data/payfactors-api';
import { UserFeatureDto } from 'libs/models';

import * as fromDashboardActions from '../actions/dashboard.actions';
import { Feature } from '../models';
import { UserFeatureDtoToFeatureMapper } from '../mappers';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadFeatures$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromDashboardActions.LOADING_FEATURES),
      switchMap(() =>
        this.dashboardApiService.getUserFeatures().pipe(
          map((userFeatureDtos: UserFeatureDto[]) => this.mapToFeatures(userFeatureDtos)),
          map((features: Feature[]) => new fromDashboardActions.LoadingFeaturesSuccess(features)),
          catchError(error => of (new fromDashboardActions.LoadingFeaturesError(error)))
        )
      )
    );

  @Effect()
  sendPendoInAppMarketingEmail$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromDashboardActions.SENDING_IN_APP_MARKETING_EMAIL),
      switchMap((action: fromDashboardActions.SendingInAppMarketingEmail) =>
        this.dashboardApiService.sendInAppMarketingEmail(action.payload.tile, action.payload.action).pipe(
          map((response) => new fromDashboardActions.SendingInAppMarketingEmailSuccess(response)),
          catchError(error => of (new fromDashboardActions.SendingInAppMarketingEmailError(error)))
        )
      )
    );

  @Effect()
  getDriftUserId$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromDashboardActions.GETTING_DRIFT_USER_ID),
      switchMap((action: fromDashboardActions.GettingDriftUserId) =>
        this.dashboardApiService.getDriftUserId(action.payload).pipe(
          map((response) => new fromDashboardActions.GettingDriftUserIdSuccess(response)),
          catchError(error => of (new fromDashboardActions.GettingDriftUserIdError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {
  }

  mapToFeatures(userFeatureDtos: UserFeatureDto[]): Feature[] {
      return userFeatureDtos
        .map(dto => UserFeatureDtoToFeatureMapper.mapToFeature(dto));
  }
}
