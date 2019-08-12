import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, mergeMap } from 'rxjs/operators';
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

  @Effect()
  syncPayfactorsReports$ = this.actions$
    .pipe(
      ofType(fromStandardReportsListPageActions.SYNC_STANDARD_REPORTS),
      switchMap(() => {
          return this.reportManagementService.syncPayfactorsReports().pipe(
            mergeMap((response) => {
              const actions = [];
              actions.push(new fromStandardReportsListPageActions.SyncStandardReportsSuccess());
              if (response > 0) {
                actions.push(new fromStandardReportsListPageActions.GetStandardReportDetails());
              }
              return actions;
            }),
            catchError(() => of(new fromStandardReportsListPageActions.GetStandardReportDetailsError()))
          );
        }
      )
    );

  @Effect()
  updatePayfactorsReportDetails$ = this.actions$
  .pipe(
    ofType(fromStandardReportsListPageActions.UPDATE_REPORT_DETAILS),
    switchMap((action: fromStandardReportsListPageActions.UpdateReportDetails) => {
      const request = PayfactorsApiModelMapper.mapEditReportFormDataToUpdatePayfactorsReportDetailsRequest(action.payload);
      return this.reportManagementService.updatePayfactorsReportDetails(request)
        .pipe(
          map((response) => {
            const reportDetails = PayfactorsApiModelMapper.mapReportDetailsResponseToStandardReportDetails([response]);
            return new fromStandardReportsListPageActions.UpdateReportDetailsSuccess(reportDetails[0]);
          }),
          catchError(() => of(new fromStandardReportsListPageActions.UpdateReportDetailsError()))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private reportManagementService: ReportManagementApiService
  ) {}
}
