import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { DataViewEntityResponseWithCount } from 'libs/models/payfactors-api/reports/response';

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
      this.store.pipe(select(fromDataInsightsMainReducer.getSortDescriptor)),
      this.store.pipe(select(fromDataInsightsMainReducer.getActiveFilters)),
      (action, dataViewAsync, fields, pagingOptions, sortDescriptor, filters) =>
        ({ action, dataViewAsync, fields, pagingOptions, sortDescriptor, filters })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewDataRequest(
        data.dataViewAsync.obj, data.fields, data.pagingOptions, data.sortDescriptor, data.filters, data.pagingOptions.From === 0);
      return this.dataViewApiService.getDataWithCount(request)
      .pipe(
        map((response: DataViewEntityResponseWithCount) => {
          if (data.pagingOptions.From > 0) {
            return new fromDataViewGridActions.GetMoreDataSuccess(response.Data);
          } else {
            return new fromDataViewGridActions.GetDataSuccess({data: response.Data, totalCount: response.TotalCount});
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

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
