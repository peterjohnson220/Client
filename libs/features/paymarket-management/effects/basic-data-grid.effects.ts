import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, withLatestFrom, mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { BasicDataViewDataRequest } from 'libs/models/payfactors-api';

import * as fromBasicDataGridActions from '../actions/basic-data-grid.actions';
import * as fromPayMarketManagementReducer from '../reducers';

@Injectable()
export class BasicDataGridEffects {
  @Effect()
  getData$ = this.actions$
    .pipe(
      ofType(
        fromBasicDataGridActions.GET_DATA,
        fromBasicDataGridActions.GET_MORE_DATA
      ),
      mergeMap((getDataAction: fromBasicDataGridActions.GetData) =>
        of(getDataAction).pipe(
          withLatestFrom(
            this.store.pipe(select(fromPayMarketManagementReducer.getBaseEntity, getDataAction.gridId)),
            this.store.pipe(select(fromPayMarketManagementReducer.getFields, getDataAction.gridId)),
            this.store.pipe(select(fromPayMarketManagementReducer.getFilters, getDataAction.gridId)),
            this.store.pipe(select(fromPayMarketManagementReducer.getPagingOptions, getDataAction.gridId)),
            this.store.pipe(select(fromPayMarketManagementReducer.getApplyDefaultFilters, getDataAction.gridId)),
            this.store.pipe(select(fromPayMarketManagementReducer.getDistinct, getDataAction.gridId)),
            (action: fromBasicDataGridActions.GetData, baseEntity, fields, filters, pagingOptions, applyDefaultFilters, distinct) =>
              ({ action, baseEntity, fields, filters, pagingOptions, applyDefaultFilters, distinct })
          )
        )
      ),
      switchMap((data) => {
        const request: BasicDataViewDataRequest = {
          BaseEntity: data.baseEntity,
          Fields: data.fields,
          Filters: data.filters,
          PagingOptions: data.pagingOptions,
          ApplyDefaultFilters: data.applyDefaultFilters,
          Distinct: data.distinct
        };
        return this.dataViewApiService.getDataWithBasicDataRequest(request)
          .pipe(
            map((response) => {
              if (request.PagingOptions.From === 0) {
                return new fromBasicDataGridActions.GetDataSuccess(data.action.gridId, response);
              } else {
                return new fromBasicDataGridActions.GetMoreDataSuccess(data.action.gridId, response);
              }
            }),
            catchError(() => of(new fromBasicDataGridActions.GetDataError(data.action.gridId)))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromPayMarketManagementReducer.State>
  ) {}
}
