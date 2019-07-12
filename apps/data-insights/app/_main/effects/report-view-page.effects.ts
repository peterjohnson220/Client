import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TableauReportApiService } from 'libs/data/payfactors-api';

import * as fromReportViewPageActions from '../actions/reports-view-page.actions';

@Injectable()
export class ReportViewPageEffects {

  @Effect()
  getStandardReport$ = this.actions$
    .pipe(
      ofType(fromReportViewPageActions.GET_STANDARD_REPORT_VIEW_URL),
      switchMap((action: fromReportViewPageActions.GetStandardReportViewUrl) => {
          return this.tableauReportApiService.getStandardReportViewUrl(action.payload.workbookId).pipe(
            map((response) => {
              return new fromReportViewPageActions.GetViewUrlSuccess(response);
            }),
            catchError(() => of(new fromReportViewPageActions.GetViewUrlError()))
          );
        }
      )
    );

  @Effect()
  getCompanyReport$ = this.actions$
    .pipe(
      ofType(fromReportViewPageActions.GET_COMPANY_REPORT_VIEW_URL),
      switchMap((action: fromReportViewPageActions.GetCompanyReportViewUrl) => {
          return this.tableauReportApiService.getCompanyReportViewUrl(action.payload.workbookId).pipe(
            map((response) => {
              return new fromReportViewPageActions.GetViewUrlSuccess(response);
            }),
            catchError(() => of(new fromReportViewPageActions.GetViewUrlError()))
          );
        }
      )
    );

  @Effect()
  getStandardReportSheet$ = this.actions$
    .pipe(
      ofType(fromReportViewPageActions.GET_STANDARD_REPORT_SHEET_VIEW_URL),
      switchMap((action: fromReportViewPageActions.GetStandardReportSheetViewUrl) => {
          return this.tableauReportApiService.getStandardReportSheetViewUrl(action.payload.workbookName, action.payload.viewName).pipe(
            map((response) => {
              return new fromReportViewPageActions.GetViewUrlSuccess(response);
            }),
            catchError(() => of(new fromReportViewPageActions.GetViewUrlError()))
          );
        }
      )
    );

  @Effect()
  getCompanyReportSheet$ = this.actions$
    .pipe(
      ofType(fromReportViewPageActions.GET_COMPANY_REPORT_SHEET_VIEW_URL),
      switchMap((action: fromReportViewPageActions.GetCompanyReportSheetViewUrl) => {
          return this.tableauReportApiService.getCompanyReportSheetViewUrl(action.payload.workbookName, action.payload.viewName).pipe(
            map((response) => {
              return new fromReportViewPageActions.GetViewUrlSuccess(response);
            }),
            catchError(() => of(new fromReportViewPageActions.GetViewUrlError()))
          );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
