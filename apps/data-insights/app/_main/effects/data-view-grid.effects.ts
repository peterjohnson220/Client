import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';
import { SaveUserDataViewSortOrderRequest } from 'libs/models/payfactors-api/reports/request';

import * as fromDataViewGridActions from '../actions/data-view-grid.actions';
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
      (action, dataViewAsync, fields, pagingOptions, sortDescriptor) =>
        ({ action, dataViewAsync, fields, pagingOptions, sortDescriptor })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewDataRequest(
        data.dataViewAsync.obj, data.fields, data.pagingOptions, data.sortDescriptor);
      return this.dataViewApiService.getData(request)
      .pipe(
        map((response: any[]) => {
          if (data.pagingOptions.From > 0) {
            return new fromDataViewGridActions.GetMoreDataSuccess(response);
          } else {
            return new fromDataViewGridActions.GetDataSuccess(response);
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
    mergeMap((action: fromDataViewGridActions.SortField) => [
      new fromDataViewGridActions.GetData(),
      new fromDataViewGridActions.SaveSortDescriptor(action.payload.sortDesc)
    ])
  );

  @Effect()
  saveSortDescriptor$ = this.action$
    .pipe(
      ofType(fromDataViewGridActions.SAVE_SORT_DESCRIPTOR),
      withLatestFrom(
        this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync)),
        (action: fromDataViewGridActions.SaveSortDescriptor, userDataView) =>
          ({ action, userDataView })
      ),
      switchMap((data) => {
        const request: SaveUserDataViewSortOrderRequest = {
          UserDataViewId: data.userDataView.obj.UserDataViewId,
          SortField: !!data.action.payload.dir ? data.action.payload.field : null,
          SortDir: !!data.action.payload.dir ? data.action.payload.dir : null
        };
        return this.dataViewApiService.saveUserDataViewSortOrder(request)
          .pipe(
            map(() => new fromDataViewGridActions.SaveSortDescriptorSuccess()),
            catchError(() => of(new fromDataViewGridActions.SaveSortDescriptorError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
