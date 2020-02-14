import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

import { ProjectApiService } from 'libs/data/payfactors-api/project';

import * as fromEmployeesPageActions from '../actions/employees-page.actions';

@Injectable()
export class EmployeesPageEffects {

  @Effect()
  priceJobs$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.PRICE_JOBS),
      switchMap((action: fromEmployeesPageActions.PriceJobs) => {
        return this.projectsApiService.createFromEmployees(action.payload.companyEmployeeIds)
          .pipe(
            map((projectId: number) => new fromEmployeesPageActions.PriceJobsSuccess({ projectId })),
            catchError(() => of(new fromEmployeesPageActions.PriceJobsError()))
          );
      })
    );

  @Effect({dispatch: false})
  priceJobsSuccess$ = this.actions$
    .pipe(
      ofType(fromEmployeesPageActions.PRICE_JOBS_SUCCESS),
      tap((action: fromEmployeesPageActions.PriceJobsSuccess) => {
        window.location.href = `/marketdata/marketdata.asp?usersession_id=${action.payload.projectId}`;
      })
    );

  constructor(
    private actions$: Actions,
    private projectsApiService: ProjectApiService
  ) {}
}
