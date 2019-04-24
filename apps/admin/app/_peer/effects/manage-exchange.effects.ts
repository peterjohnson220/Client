import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { NEVER } from 'rxjs/internal/observable/never';
import { map, switchMap, catchError, withLatestFrom, tap } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { Exchange, ExchangeJobsValidationResultModel } from 'libs/models';

import { GridHelperService } from '../services';
import { ExchangeManagementDetails } from '../models';
import * as fromImportExchangeJobActionActions from '../actions/import-exchange-jobs.actions';
import * as fromExchangeActions from '../actions/exchange.actions';
import * as fromExchangeCompaniesActions from '../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class ManageExchangeEffects {

  @Effect()
  uploadingFile$: Observable<Action> = this.actions$.pipe(
      ofType(fromImportExchangeJobActionActions.UPLOADING_FILE),
      switchMap((action: fromImportExchangeJobActionActions.UploadingFile) =>
        this.exchangeApiService.validateExchangeJobs(action.payload).pipe(
          map((exchangeJobsValidationResultModel: ExchangeJobsValidationResultModel) => {
            return new fromImportExchangeJobActionActions.UploadingFileSuccess(exchangeJobsValidationResultModel);
          }),
          catchError(error => of(new fromImportExchangeJobActionActions.UploadingFileError()))
        )
      )
    );

  @Effect()
  importingFile: Observable<Action> = this.actions$.pipe(
      ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS),
      map((action: fromImportExchangeJobActionActions.ImportingExchangeJobs) => action.payload),
      switchMap((payload) => {
          return this.exchangeApiService.importExchangeJobs(payload).pipe(
            map((exchangeJobsValidationResultModel) => {
              this.gridHelperService.loadExchangeJobs(payload.ExchangeId);
              return new fromImportExchangeJobActionActions.ImportingExchangeJobsSuccess(exchangeJobsValidationResultModel);
            }),
            catchError(error => of(new fromImportExchangeJobActionActions.ImportingExchangeJobsError()))
          );
        }
      )
    );

  @Effect()
  importingFileSuccess$: Observable<Action> = this.actions$.pipe(
      ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS_SUCCESS),
      switchMap(() => of(new fromImportExchangeJobActionActions.ClosingImportExchangeJobsModal()))
    );

  @Effect()
  updateExchangeStatus$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeActions.UPDATE_EXCHANGE_STATUS),
    map((action: fromExchangeActions.UpdateExchangeStatus) => {
      return {exchangeId: action.exchangeId, newStatus: action.newStatus};
    }),
    switchMap((payload) => {
      return this.exchangeApiService.updateExchangeStatus(payload).pipe(
        map((exchange: Exchange) => new fromExchangeActions.UpdateExchangeStatusSuccess(exchange)),
        catchError(error => of(new fromExchangeActions.UpdateExchangeStatusError))
      );
    })
  );

  @Effect()
  loadExchangeManagement$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeActions.LOAD_EXCHANGE_MANAGEMENT_DETAILS),
    map((action: fromExchangeActions.LoadExchangeManagementDetails) => action.payload),
    switchMap((payload) => {
      return this.exchangeApiService
        .getExchangeManagementDetails(payload).pipe(
          map((exchange: ExchangeManagementDetails) => new fromExchangeActions.LoadExchangeManagementDetailsSuccess(exchange)),
          catchError((error) => of(new fromExchangeActions.LoadExchangeManagementDetailsError)));
    })
  );

  @Effect()
  companiesChanged$: Observable<never> = this.actions$.pipe(
    ofType(fromExchangeCompaniesActions.ADDING_EXCHANGE_COMPANIES_SUCCESS,
      fromExchangeCompaniesActions.DELETING_EXCHANGE_COMPANY_SUCCESS),
    withLatestFrom(this.store.pipe(select(fromPeerAdminReducer.getManageExchange)),
      (action, storePayload) => storePayload.ExchangeId
    ),
    tap((exchangeId: number) => {
      this.store.dispatch(new fromExchangeActions.LoadExchangeManagementDetails(exchangeId));
    }),
    switchMap(() => NEVER)
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService,
    private store: Store<fromPeerAdminReducer.State>
  ) {}
}


