import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ReportManagementApiService } from 'libs/data/payfactors-api';

import * as fromStandardReportsListPageActions from '../actions/standard-reports-list-page.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class StandardReportsListPageEffects {

  @Effect()
  getStandardReportDetails$ = this.actions$
    .pipe(
      ofType(fromStandardReportsListPageActions.GET_STANDARD_REPORT_DETAILS),
      switchMap(() => {
          return this.reportManagementService.getPayfactorsReportsDetails().pipe(
            map((response) => {
              return new fromStandardReportsListPageActions.GetStandardReportDetailsSuccess(
                PayfactorsApiModelMapper.mapReportDetailsResponseToStandardReportDetails(response)
              );
            }),
            catchError(() => of(new fromStandardReportsListPageActions.GetStandardReportDetailsError()))
          );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private reportManagementService: ReportManagementApiService
  ) {}
}
