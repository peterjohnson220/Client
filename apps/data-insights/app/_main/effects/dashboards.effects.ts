import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TableauReportApiService } from 'libs/data/payfactors-api';

import * as fromAllDashboardsActions from '../actions/dashboards.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DashboardsEffects {

  @Effect()
  getCompanyReports$ = this.action$
  .pipe(
    ofType(fromAllDashboardsActions.GET_COMPANY_REPORTS),
    switchMap(() => {
      return this.tableauReportApiService.getCompanyReports()
        .pipe(
          map((response) => {
            return new fromAllDashboardsActions.GetCompanyReportsSuccess(
              PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response)
            );
          }),
          catchError(() => of(new fromAllDashboardsActions.GetCompanyReportsError()))
        );
    })
  );

  constructor(
    private action$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
