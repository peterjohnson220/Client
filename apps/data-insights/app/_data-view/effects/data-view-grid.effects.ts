import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { DataViewEntityResponse } from 'libs/models/payfactors-api/reports/response';

import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
import * as fromFieldActions from '../actions/fields.actions';
import * as fromDataInsightsMainReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DataViewGridEffects {

  @Effect()
  getData$ = this.action$
  .pipe(
    ofType(
      fromDataViewGridActions.GET_DATA,
      fromDataViewGridActions.GET_MORE_DATA
    ),
    withLatestFrom(
      this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
      this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields)),
      this.store.pipe(select(fromDataInsightsMainReducer.getPagingOptions)),
      this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
      (action, dataViewAsync, fields, pagingOptions, filters) =>
        ({ action, dataViewAsync, fields, pagingOptions, filters })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewDataRequest(
        data.dataViewAsync.obj, data.fields, data.pagingOptions, data.filters, false);
      return this.dataViewApiService.getData(request)
      .pipe(
        map((response: DataViewEntityResponse[]) => {
          if (data.pagingOptions.From > 0) {
            return new fromDataViewGridActions.GetMoreDataSuccess(response);
          } else {
            return new fromDataViewGridActions.GetDataSuccess({data: response});
          }
        }),
        catchError(() => of(new fromDataViewGridActions.GetDataError()))
      );
    })
  );

  @Effect()
  sortField$ = this.action$
  .pipe(
    ofType(fromDataViewGridActions.SORT_FIELD),
    map((action: fromDataViewGridActions.SortField) => {
      return new fromFieldActions.SortField({ field: action.payload.field, sortDirection: action.payload.sortDesc.dir });
    })
  );

  @Effect()
  getDataCount$ = this.action$
  .pipe(
    ofType(fromDataViewGridActions.GET_DATA_COUNT),
    withLatestFrom(
      this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
      this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields)),
      this.store.pipe(select(fromDataInsightsMainReducer.getPagingOptions)),
      this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
      (action, dataViewAsync, fields, pagingOptions, filters) =>
        ({ action, dataViewAsync, fields, pagingOptions, filters })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewDataRequest(
        data.dataViewAsync.obj, data.fields, data.pagingOptions, data.filters, false);
      return this.dataViewApiService.getDataCount(request)
        .pipe(
          map((response) => new fromDataViewGridActions.GetDataCountSuccess({ totalCount: response })),
          catchError(() => of(new fromDataViewGridActions.GetDataCountError()))
        );
    })
  );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
