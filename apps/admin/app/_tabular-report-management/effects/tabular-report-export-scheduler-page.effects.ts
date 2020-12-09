import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { TableauReportApiService } from 'libs/data/payfactors-api/reports';
import { ReportsPayfactorsApiModelMapper } from 'libs/features/reports/helpers';
import { UserContext } from 'libs/models/security';
import * as fromRootState from 'libs/state/state';

import * as fromTabularReportExportSchedulerPageReducer from '../reducers';
import * as fromTabularReportExportSchedulerPageActions from '../actions/tabular-report-export-scheduler-page.actions';

@Injectable()
export class TabularReportExportSchedulerPageEffects {
  @Effect()
  getTabularReports$ = this.action$
    .pipe(
      ofType(fromTabularReportExportSchedulerPageActions.GET_TABULAR_REPORTS),
      withLatestFrom(
        this.store.pipe(select(fromRootState.getUserContext)),
        (action, userContext: UserContext) => ({ userContext })
      ),
      switchMap((data) => {
        return this.tableauReportApiService.getReportBuilderViews()
          .pipe(
            map((response) => {
              return new fromTabularReportExportSchedulerPageActions.GetTabularReportsSuccess(
                ReportsPayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response, data.userContext.CompanyName)
              );
            }),
            catchError(() => of(new fromTabularReportExportSchedulerPageActions.GetTabularReportsError()))
          );
      })
    );

  constructor(
    private action$: Actions,
    private store: Store<fromTabularReportExportSchedulerPageReducer.State>,
    private tableauReportApiService: TableauReportApiService,
  ) { }
}
