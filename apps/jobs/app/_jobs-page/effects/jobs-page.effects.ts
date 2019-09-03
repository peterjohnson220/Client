import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyApiService } from 'libs/data/payfactors-api';

import * as fromJobsPageActions from '../actions/jobs-page.actions';

@Injectable()
export class JobsPageEffects {

  @Effect()
  loadCompany$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsPageActions.LOAD_COMPANY),
    map((action: fromJobsPageActions.LoadCompany) => action.payload),
    switchMap((companyId) => {
      return this.companyApiService.get(companyId).pipe(
        map((response) => new fromJobsPageActions.LoadCompanySuccess(response)),
        catchError(() => of(new fromJobsPageActions.LoadCompanyError()))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) {}
}
