import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { CompanyApiService } from '../../../data/payfactors-api';
import * as companyContextActions from '../actions/company-context.actions';

@Injectable()
export class CompanyContextEffects {

  @Effect()
  getCompanyContext$ = this.actions$.pipe(
    ofType(companyContextActions.GET_COMPANY_CONTEXT),
    switchMap(() => this.companyApiService.getCompany().pipe(
      map((company: any) => new companyContextActions.GetCompanyContextSuccess(company)),
      catchError(error => {
        return of(new companyContextActions.GetCompanyContextError(error));
      })
    )
    )
  );

  constructor(private actions$: Actions,
              private companyApiService: CompanyApiService) { }
}
