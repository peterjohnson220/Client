import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom, switchMap, tap } from 'rxjs/operators';

import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';
import { ExchangeCompanyApiService } from 'libs/data/payfactors-api';

import * as fromExchangeCompanyJobGridActions from '../actions/exchange-company-job-grid.actions';
import * as fromPeerMapReducer from '../reducers';
import * as fromSharedPeerReducer from '../../shared/reducers';

@Injectable()
export class ExchangeCompanyJobsGridEffects {
  @Effect()
  loadExchangeCompanyJobs$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeCompanyJobGridActions.LOAD_EXCHANGE_COMPANY_JOBS),
      withLatestFrom(
        this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridState)),
        this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchangeId)),
        this.libsPeerMapStore.pipe(select(fromLibsPeerMapReducer.getPeerMapExchangeJobIdsFromSummary)),
        (action, listState, exchangeId, exchangeJobIds) => {
          return {exchangeId, listState, exchangeJobIds};
        }
      ),
      switchMap(payload =>
        this.exchangeCompanyApiService.getExchangeCompanyJobs(payload.exchangeId, payload.listState).pipe(
          map((gridDataResult: GridDataResult) => {
            return new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsSuccess(gridDataResult, payload.exchangeJobIds);
          }),
          catchError(() => of(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsError)
        )
      )
    ));

  @Effect()
  loadExchangeCompanyJobsIds$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromExchangeCompanyJobGridActions.LOAD_EXCHANGE_COMPANY_JOBS_IDS),
      withLatestFrom(
        this.store.pipe(select(fromPeerMapReducer.getExchangeCompanyJobsGridState)),
        this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchangeId)),
        (action, listState, exchangeId) => {
          return {ExchangeId: exchangeId, ListState: listState};
        }
      ),
      switchMap(payload =>
        this.exchangeCompanyApiService.getExchangeCompanyJobsAllEntities(payload).pipe(
          map((exchangeJobToCompanyJobIds: number[]) => {
            return new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsIdsSuccess(exchangeJobToCompanyJobIds);
          }),
          catchError(() => of(new fromExchangeCompanyJobGridActions.LoadExchangeCompanyJobsIdsError)
          )
        )
      ));

  constructor(
    private actions$: Actions,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private store: Store<fromPeerMapReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private libsPeerMapStore: Store<fromLibsPeerMapReducer.State>
  ) {}
}


