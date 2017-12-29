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

import * as fromDashboardActions from '../actions/dashboard.actions';
import { Feature } from '../models';
import { FeatureMapper } from '../mappers/feature.mapper';

@Injectable()
export class DashboardEffects {
  @Effect()
  loadFeatures$: Observable<Action> = this.actions$
    .ofType(fromDashboardActions.LOADING_FEATURES)
    .switchMap(() =>
      this.dashboardApiService.getUserDashboardTiles()
        .map((userTileDtos: UserTileDto[]) => this.mapUserTileDtosToFeatures(userTileDtos))
        .map((features: Feature[]) => new fromDashboardActions.LoadingFeaturesSuccess(features))
        .catch(error => of (new fromDashboardActions.LoadingFeaturesError(error)))
    );

  constructor(
    private actions$: Actions,
    private dashboardApiService: DashboardApiService
  ) {}

  mapUserTileDtosToFeatures(userTileDtos: UserTileDto[]): Feature[] {
      return userTileDtos
        .map(dto => FeatureMapper.MapUserTileDtoToFeature(dto));
  }
}
