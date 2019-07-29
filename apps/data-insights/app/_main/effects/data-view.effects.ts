import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { DataViewApiService } from 'libs/data/payfactors-api';

import * as fromDataViewActions from '../actions/data-view.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';
import { Entity } from '../models';
import { of } from 'rxjs';

@Injectable()
export class DataViewEffects {

  @Effect()
  getBaseEntities$ = this.action$
  .pipe(
    ofType(fromDataViewActions.GET_BASE_ENTITIES),
    switchMap(() => {
      return this.dataViewApiService.getBaseEntities()
      .pipe(
        map((response) => {
          const baseEntities: Entity[] = PayfactorsApiModelMapper.mapDataViewEntityResponsesToEntities(response);
          return new fromDataViewActions.GetBaseEntitiesSuccess(baseEntities);
        }),
        catchError(() => of(new fromDataViewActions.GetBaseEntitiesError()))
      );
    })
  );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService
  ) {}
}
