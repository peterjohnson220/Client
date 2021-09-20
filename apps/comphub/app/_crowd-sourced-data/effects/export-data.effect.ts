import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';
import { HtmlToPdfGenerationApiService } from 'libs/data/payfactors-api/html-to-pdf-generation';
import { PdfTypeConstantsEnum } from 'libs/models/html-to-pdf-generation';

import * as fromComphubCrowdSourcedDataReducer from '../reducers';
import * as fromComphubSharedReducer from '../../_shared/reducers';
import * as fromExportDataActions from '../actions/export-data.actions';
import { PrintConstants } from '../../_print/constants';

@Injectable()
export class ExportDataEffect {

  @Effect()
  saveExportData$ = this.actions$
    .pipe(
      ofType(
        fromExportDataActions.SAVE_EXPORT_DATA
      ),
      withLatestFrom(
        this.store.select(fromComphubCrowdSourcedDataReducer.getExportDataAsyncObj),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedPaymarket),
        this.sharedStore.select(fromComphubSharedReducer.getSelectedRate),
        (action: fromExportDataActions.SaveExportData, exportDataAsyncObj, selectedJob, selectedPaymarket, selectedRate) =>
          ({ action, exportDataAsyncObj, selectedJob, selectedPaymarket, selectedRate })
      ),
      switchMap((data) => {
          return this.comphubCSDApiService.saveExportData({
            JsonAnswer: data.exportDataAsyncObj.obj.JsonAnswer,
            JsonReport: data.exportDataAsyncObj.obj.JsonReport,
            PayscaleJobTitle: data.selectedJob.JobTitle,
            CompanyPayMarketId: data.selectedPaymarket.CompanyPayMarketId,
            Rate: data.selectedRate
          }).pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new fromExportDataActions.GeneratePdfExport(response));
              actions.push(new fromExportDataActions.SaveExportDataSuccess());
              return actions;
            }),
            catchError(() => of(new fromExportDataActions.SaveExportDataError()))
          );
        }
      ));

  @Effect()
  generatePdfExport$ = this.actions$
    .pipe(
      ofType(
        fromExportDataActions.GENERATE_PDF_EXPORT
      ),
      withLatestFrom(
        this.sharedStore.select(fromComphubSharedReducer.getSelectedJobData),
        (action: fromExportDataActions.GeneratePdfExport, selectedJobData) =>
          ({action, selectedJobData})
      ),
      switchMap((data) => {
          return this.htmlToPdfGenerationApiService.startPdfGeneration({
            PdfType: PdfTypeConstantsEnum.QuickPrice,
            HtmlUrl: `client/comphub/print/${data.action.payload}`,
            FileName: `PricingSummaryFor(${data.selectedJobData.JobTitle}).pdf`,
            WaitForSelector: PrintConstants.READY_FOR_PDF_GENERATION_SELECTOR
          }).pipe(
            map((response) => {
              return new fromExportDataActions.GeneratePdfExportSuccess();
            }),
            catchError(() => of(new fromExportDataActions.GeneratePdfExportError()))
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubCrowdSourcedDataReducer.State>,
    private sharedStore: Store<fromComphubSharedReducer.State>,
    private comphubCSDApiService: ComphubCrowdSourcedApiService,
    private htmlToPdfGenerationApiService: HtmlToPdfGenerationApiService
  ) {}
}
