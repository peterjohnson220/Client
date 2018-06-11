import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import {map, switchMap, catchError} from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api';
import { ExchangeJobsValidationResultModel } from 'libs/models';

import { GridHelperService } from '../services/grid-helper.service';
import * as fromImportExchangeJobActionActions from '../actions/import-exchange-jobs.actions';

@Injectable()
export class ManageExchangeEffects {

  @Effect()
  uploadingFile$: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.UPLOADING_FILE).pipe(
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
  importingFile: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS).pipe(
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
  importingFileSuccess$: Observable<Action> = this.actions$
    .ofType(fromImportExchangeJobActionActions.IMPORTING_EXCHANGE_JOBS_SUCCESS).pipe(
      switchMap(() => of(new fromImportExchangeJobActionActions.ClosingImportExchangeJobsModal()))
    );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}


