import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

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
    .ofType(fromDashboardActions.LOADING_FEATURES).pipe(
      switchMap(() =>
        this.dashboardApiService.getUserFeatures().pipe(
          map((userFeatureDtos: UserFeatureDto[]) => this.mapToFeatures(userFeatureDtos)),
          map((features: Feature[]) => new fromDashboardActions.LoadingFeaturesSuccess(features)),
          catchError(error => of (new fromDashboardActions.LoadingFeaturesError(error)))
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
