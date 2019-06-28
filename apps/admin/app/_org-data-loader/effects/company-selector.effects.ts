import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Company } from 'libs/models/company/company.model';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromCompanySelectorActions from '../actions/company-selector.actions';

@Injectable()
export class CompanySelectorEffects {

  @Effect()
  loadCompanies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanySelectorActions.LOADING_COMPANIES),
      switchMap(() =>
        this.companyApiService.getCompanies()
          .pipe(
            map((companies: Company[]) => new fromCompanySelectorActions.LoadingCompaniesSuccess(companies)),
            catchError(error => of(new fromCompanySelectorActions.LoadingCompaniesError()))
          )

      )
    );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) {}
}
