import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, debounceTime, withLatestFrom, mergeMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PfConstants } from 'libs/models/common';

import * as fromConfigurationActions from '../actions/configuration.actions';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DataViewConfigurationEffects {

  @Effect()
  getFilterOptions$ = this.action$
  .pipe(
    ofType(fromConfigurationActions.GET_FILTER_OPTIONS),
    debounceTime(PfConstants.DEBOUNCE_DELAY),
    withLatestFrom(
      this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
      (action: fromConfigurationActions.GetFilterOptions, dataView) => ({ action, dataView })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewFilterOptionsRequest(data.action.payload, data.dataView.obj.BaseEntityId);
      return this.dataViewApiService.getFilterOptions(request)
        .pipe(
          map((response) => new fromConfigurationActions.GetFilterOptionsSuccess({
            index: data.action.payload.FilterIndex,
            options: response
          })),
          catchError(() => of(new fromConfigurationActions.GetFilterOptionsError()))
        );
    })
  );

  @Effect()
  activeFiltersChanged$ = this.action$
    .pipe(
      ofType(
        fromConfigurationActions.APPLY_FILTERS,
        fromConfigurationActions.REMOVE_ACTIVE_FILTER_BY_INDEX
      ),
      mergeMap(() => [
        new fromDataViewGridActions.GetData(),
        new fromConfigurationActions.SaveFilters()
      ])
    );

  @Effect()
  removeActiveFiltersByField$ = this.action$
  .pipe(
    ofType(fromConfigurationActions.REMOVE_ACTIVE_FILTERS_BY_FIELD),
    map(() => new fromConfigurationActions.SaveFilters())
  );

  @Effect()
  saveFilters$ = this.action$
    .pipe(
      ofType(fromConfigurationActions.SAVE_FILTERS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
        this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
        (action: fromConfigurationActions.SaveFilters, userDataView, filters) =>
          ({ action, userDataView, filters })
      ),
      switchMap((data) => {
        const request = PayfactorsApiModelMapper.buildSaveFiltersRequest(data.filters, data.userDataView.obj);
        return this.dataViewApiService.saveFilters(request)
          .pipe(
            map(() => new fromConfigurationActions.SaveFiltersSuccess()),
            catchError(() => of(new fromConfigurationActions.SaveFiltersError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
