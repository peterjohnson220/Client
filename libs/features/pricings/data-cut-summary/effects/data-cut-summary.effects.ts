import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import { Observable, of } from 'rxjs/index';
import { catchError, map, switchMap, mergeMap, withLatestFrom, filter } from 'rxjs/operators';

import { DataCutSummaryEntityTypes } from 'libs/constants';
import * as fromSurveySearchReducer from 'libs/features/surveys/survey-search/reducers';
import { DataCutSummaryApiService } from 'libs/data/payfactors-api/pricing';

import * as fromDataCutSummaryActions from '../actions';
import * as fromDataCutSummaryReducer from '../reducers';

@Injectable()
export class DataCutSummaryEffects {
  constructor(private actions$: Actions,
              private dataCutSummaryService: DataCutSummaryApiService,
              private store: Store<fromDataCutSummaryReducer.State>) {
  }

  @Effect()
  getDataCutSummary$ = this.actions$
    .pipe(
      ofType(fromDataCutSummaryActions.LOAD_DATA_CUT_SUMMARY),
      filter(
        (action: fromDataCutSummaryActions.LoadDataCutSummary) =>
          action.payload.entityType !== DataCutSummaryEntityTypes.CustomPeerCutId
      ),
      withLatestFrom(
        this.store.pipe(select(fromDataCutSummaryReducer.getDataCutSummaryDictionary)),
        (action: fromDataCutSummaryActions.LoadDataCutSummary, dataCutSummaryDictionary) =>
          ({action, dataCutSummaryDictionary})
      ),
      switchMap((data: any) => {
          const dataCutKey = data.action.payload.entityId + data.action.payload.entityType;

          if (data.dataCutSummaryDictionary[dataCutKey]) {
            return of(new fromDataCutSummaryActions.LoadDataCutSummarySuccess(data.dataCutSummaryDictionary[dataCutKey]));
          } else {
            return this.dataCutSummaryService.getDataCutSummary(data.action.payload.entityId, data.action.payload.entityType).pipe(
              switchMap((response: any) =>
                [new fromDataCutSummaryActions.LoadDataCutSummarySuccess(response),
                  new fromDataCutSummaryActions.AddDataCutSummary({
                    dataCutKey: dataCutKey,
                    response: response
                  })]
              ),
              catchError(response => of(new fromDataCutSummaryActions.LoadDataCutSummaryError()))
            );
          }
        }
      )
    );

  @Effect()
  getDataCutSummaryForCustomScope$: Observable<Action> = this.actions$.pipe(
    ofType<fromDataCutSummaryActions.LoadDataCutSummary>(fromDataCutSummaryActions.LOAD_DATA_CUT_SUMMARY),
    filter(action => action.payload.entityType === DataCutSummaryEntityTypes.CustomPeerCutId),
    withLatestFrom(
      this.store.pipe(select(fromSurveySearchReducer.getTempExchangeJobDataCutFilterContextDictionary)),
      this.store.pipe(select(fromDataCutSummaryReducer.getDataCutSummaryDictionary)),
      (action: fromDataCutSummaryActions.LoadDataCutSummary, filterContextDictionary, dataCutSummaryDictionary) =>
        ({action, filterContextDictionary, dataCutSummaryDictionary})
    ),
    switchMap((data: any) => {
        const dataCutKey = data.action.payload.entityId;
        if (data.dataCutSummaryDictionary[dataCutKey]) {
          return of(new fromDataCutSummaryActions.LoadDataCutSummarySuccess(data.dataCutSummaryDictionary[dataCutKey]));
        } else {
          const request = data.filterContextDictionary[data.action.payload.entityId];
          return this.dataCutSummaryService.getDataCutSummaryForCustomScope(request).pipe(
            switchMap((response: any) =>
              [new fromDataCutSummaryActions.LoadDataCutSummarySuccess(response),
                new fromDataCutSummaryActions.AddDataCutSummary({
                  dataCutKey: dataCutKey,
                  response: response
                })]
            ),
            catchError(response => of(new fromDataCutSummaryActions.LoadDataCutSummaryError()))
          );
        }
      }
    )
  );
}
