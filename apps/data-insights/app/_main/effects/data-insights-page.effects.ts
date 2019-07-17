import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { TableauReportApiService } from 'libs/data/payfactors-api';

import * as fromDataInsightsPageActions from '../actions/data-insights-page.actions';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class DataInsightsPageEffects {

  @Effect()
  getStandardReports$ = this.actions$
    .pipe(
      ofType(fromDataInsightsPageActions.GET_STANDARD_REPORTS),
      switchMap(() => {
          return this.tableauReportApiService.getStandardReports().pipe(
            map((response) => {
              return new fromDataInsightsPageActions.GetStandardReportsSuccess(
                PayfactorsApiModelMapper.mapTableauReportResponsesToWorkbooks(response)
              );
            }),
            catchError(() => of(new fromDataInsightsPageActions.GetStandardReportsError()))
          );
        }
      )
    );

  constructor(
    private actions$: Actions,
    private tableauReportApiService: TableauReportApiService
  ) {}
}
