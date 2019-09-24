import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, debounceTime, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PfConstants } from 'libs/models/common';

import * as fromConfigurationActions from '../actions/configuration.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';

import * as fromDataInsightsMainReducer from '../reducers';

@Injectable()
export class DataViewConfigurationEffects {

  @Effect()
  getFilterOptions$ = this.action$
  .pipe(
    ofType(fromConfigurationActions.GET_FILTER_OPTIONS),
    debounceTime(PfConstants.DEBOUNCE_DELAY),
    switchMap((action: fromConfigurationActions.GetFilterOptions) => {
      const request = PayfactorsApiModelMapper.buildDataViewFilterOptionsRequest(action.payload);
      return this.dataViewApiService.getFilterOptions(request)
        .pipe(
          map((response) => new fromConfigurationActions.GetFilterOptionsSuccess({
            index: action.payload.FilterIndex,
            options: response
          })),
          catchError(() => of(new fromConfigurationActions.GetFilterOptionsError()))
        );
    })
  );

  @Effect()
  applyFilters$ = this.action$
    .pipe(
      ofType(fromConfigurationActions.APPLY_FILTERS),
      mergeMap((action: fromConfigurationActions.ApplyFilters) => [
        new fromDataViewGridActions.GetData(),
        new fromDataViewGridActions.SaveFilters(action.payload)
      ])
    );

  @Effect()
  removeFilter$ = this.action$
    .pipe(
      ofType(fromConfigurationActions.REMOVE_FILTER),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getFilters)),
        (action, filters) => ({ action, filters })
      ),
      mergeMap((data) => [
        new fromDataViewGridActions.SaveFilters(data.filters)
      ])
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
