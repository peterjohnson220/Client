import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/concatMap';
import { of } from 'rxjs/observable/of';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeJobsValidationResultModel } from 'libs/models';

import * as fromImportExchangeJobActionActions from '../actions/import-exchange-jobs.actions';
import * as fromExchangeJobActions from '../actions/exchange-jobs.actions';

@Injectable()
export class ManageExchangeEffects {

  @Effect()
  uploadingFile$: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.UPLOADING_FILE)
    .switchMap((action: fromImportExchangeJobActionActions.UploadingFile) =>
      this.exchangeApiService.validateExchangeJobs(action.payload)
        .map((exchangeJobsValidationResultModel: ExchangeJobsValidationResultModel) => {
          return new fromImportExchangeJobActionActions.UploadingFileSuccess(exchangeJobsValidationResultModel);
        })
        .catch(error => of(new fromImportExchangeJobActionActions.UploadingFileError()))
    );

  @Effect()
  importingFile: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS)
    .switchMap((action: fromImportExchangeJobActionActions.ImportingExchangeJobs) =>
      this.exchangeApiService.importExchangeJobs(action.payload)
        .concatMap((exchangeJobsValidationResultModel: ExchangeJobsValidationResultModel) => {
          return [
            new fromImportExchangeJobActionActions.ImportingExchangeJobsSuccess(exchangeJobsValidationResultModel),
            new fromExchangeJobActions.LoadingExchangeJobs(action.payload.ExchangeId),
          ];
        })
        .catch(error => of(new fromImportExchangeJobActionActions.ImportingExchangeJobsError()))
    );

  @Effect()
  importingFileSuccess$: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS_SUCCESS)
    .switchMap(() => of(new fromImportExchangeJobActionActions.ClosingImportExchangeJobsModal()));

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}


