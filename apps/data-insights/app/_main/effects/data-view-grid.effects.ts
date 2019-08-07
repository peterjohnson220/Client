import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataViewApiService } from 'libs/data/payfactors-api';

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
      (action, dataViewAsync, fields, pagingOptions) => ({ action, dataViewAsync, fields, pagingOptions })
    ),
    switchMap((data) => {
      const request = PayfactorsApiModelMapper.buildDataViewDataRequest(data.dataViewAsync.obj, data.fields, data.pagingOptions);
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

  constructor(
    private action$: Actions,
    private dataViewApiService: DataViewApiService,
    private store: Store<fromDataInsightsMainReducer.State>
  ) {}
}
