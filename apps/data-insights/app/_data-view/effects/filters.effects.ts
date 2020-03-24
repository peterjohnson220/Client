import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, debounceTime, withLatestFrom, mergeMap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { PfConstants } from 'libs/models/common';

import * as fromFiltersActions from '../actions/filters.actions';
import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import * as fromFieldsActions from '../actions/fields.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class FiltersEffects {

  @Effect()
  getFilterOptions$ = this.action$
  .pipe(
    ofType(fromFiltersActions.GET_FILTER_OPTIONS),
    debounceTime(PfConstants.DEBOUNCE_DELAY),
    withLatestFrom(
      this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
      (action: fromFiltersActions.GetFilterOptions, dataView) => ({ action, dataView })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewFilterOptionsRequest(data.action.payload, data.dataView.obj.Entity.Id);
      return this.dataViewApiService.getFilterOptions(request)
        .pipe(
          map((response) => new fromFiltersActions.GetFilterOptionsSuccess({
            index: data.action.payload.FilterIndex,
            options: response
          })),
          catchError(() => of(new fromFiltersActions.GetFilterOptionsError()))
        );
    })
  );

  @Effect()
  activeFiltersChanged$ = this.action$
    .pipe(
      ofType(
        fromFiltersActions.APPLY_FILTERS,
        fromFiltersActions.REMOVE_ACTIVE_FILTER_BY_INDEX
      ),
      mergeMap(() => [
        new fromFiltersActions.SaveFilters(),
        new fromDataViewGridActions.GetData(),
        new fromDataViewGridActions.GetDataCount()
      ])
    );

  @Effect()
  removeActiveFiltersByField$ = this.action$
  .pipe(
    ofType(fromFiltersActions.REMOVE_ACTIVE_FILTERS_BY_FIELD),
    map(() => new fromFiltersActions.SaveFilters())
  );

  @Effect()
  saveFilters$ = this.action$
    .pipe(
      ofType(fromFiltersActions.SAVE_FILTERS),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
        this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
        (action: fromFiltersActions.SaveFilters, userDataView, filters) =>
          ({ action, userDataView, filters })
      ),
      switchMap((data) => {
        const request = PayfactorsApiModelMapper.buildSaveFiltersRequest(data.filters, data.userDataView.obj);
        return this.dataViewApiService.saveFilters(request)
          .pipe(
            map(() => new fromFiltersActions.SaveFiltersSuccess()),
            catchError(() => of(new fromFiltersActions.SaveFiltersError()))
          );
      })
    );

  @Effect()
  fieldFormatChange$ = this.action$
    .pipe(
      ofType(
        fromFieldsActions.SET_FORMAT_ON_SELECTED_FIELD,
        fromFieldsActions.CLEAR_FORMATING
      ),
      map((action: fromFieldsActions.SetFormatOnSelectedField) => {
        return new fromFiltersActions.UpdateFilterFormat(action.payload);
      })
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
