import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TableauReportApiService } from 'libs/data/payfactors-api/data-insights';

import * as fromAllDashboardsActions from '../actions/all-dashboards.action';
import { TableauReportApiModelMapper } from '../helpers';

@Injectable()
export class AllDashboardsEffects {

  @Effect()
  getCompanyReports$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.GET_COMPANY_REPORTS),
    switchMap(() => {
      return this.tableauReportApiService.getCompanyReports()
        .pipe(
          map((response) => {
            const reports = TableauReportApiModelMapper.mapTableauReportResponseToTableauReport(response);
            return new fromAllDashboardsActions.GetCompanyReportsSuccess({ tableauReports : reports });
          }),
          catchError((error) => of(new fromAllDashboardsActions.GetCompanyReportsError()))
        );
    })
  );

  constructor(
    private action$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
