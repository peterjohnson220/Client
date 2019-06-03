import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api';
import { CompanyJob } from 'libs/models/company';

import * as fromCompanyJobActions from '../actions/company-job.actions';

@Injectable()
export class CompanyJobEffects {

  @Effect()
  getCompanyJob$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyJobActions.LOADING),
      switchMap((action: fromCompanyJobActions.Loading) =>
        this.companyJobApiService.getCompanyJobTitleAndCode(action.payload)
          .pipe(
            map((companyJob: CompanyJob) => new fromCompanyJobActions.LoadingSuccess(companyJob)),
            catchError(error => of(new fromCompanyJobActions.LoadingError()))
          )
        )
      );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
