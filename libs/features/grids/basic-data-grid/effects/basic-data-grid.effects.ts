import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, withLatestFrom, mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { BasicDataViewDataRequest } from 'libs/models/payfactors-api';

import * as fromBasicDataGridActions from '../actions/basic-data-grid.actions';
import * as fromBasicDataGridReducer from '../reducers';

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
            this.store.pipe(select(fromBasicDataGridReducer.getBaseEntity, getDataAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getFields, getDataAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getFilters, getDataAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getPagingOptions, getDataAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getApplyDefaultFilters, getDataAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getDistinct, getDataAction.gridId)),
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

  @Effect()
  getCount$ = this.actions$
    .pipe(
      ofType(fromBasicDataGridActions.GET_COUNT),
      mergeMap((getCountAction: fromBasicDataGridActions.GetCount) => of(getCountAction)
        .pipe(
          withLatestFrom(
            this.store.pipe(select(fromBasicDataGridReducer.getBaseEntity, getCountAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getFields, getCountAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getFilters, getCountAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getPagingOptions, getCountAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getApplyDefaultFilters, getCountAction.gridId)),
            this.store.pipe(select(fromBasicDataGridReducer.getDistinct, getCountAction.gridId)),
            (action: fromBasicDataGridActions.GetData, baseEntity, fields, filters, pagingOptions, applyDefaultFilters, distinct) =>
              ({ action, baseEntity, fields, filters, pagingOptions, applyDefaultFilters, distinct })
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
            return this.dataViewApiService.getCountWithBasicDataRequest(request)
              .pipe(
                map((response) => new fromBasicDataGridActions.GetCountSuccess(data.action.gridId, response)),
                catchError(() => of(new fromBasicDataGridActions.GetCountError(data.action.gridId)))
              );
          })
        )
      )
    );

  @Effect()
  updateSort$ = this.actions$
    .pipe(
      ofType(fromBasicDataGridActions.UPDATE_SORT),
      map((action: fromBasicDataGridActions.UpdateSort) => new fromBasicDataGridActions.GetData(action.gridId))
    );

  constructor(
    private actions$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromBasicDataGridReducer.State>
  ) {}
}
