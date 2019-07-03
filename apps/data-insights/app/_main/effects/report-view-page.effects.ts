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
          return this.tableauReportApiService.getStandardReportViewUrl(action.payload).pipe(
            map((response) => {
              return new fromReportViewPageActions.GetStandardReportViewUrlSuccess(response);
            }),
            catchError(() => of(new fromReportViewPageActions.GetStandardReportViewUrlError()))
          );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
