import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyBaseInformation } from 'libs/models/company';

import * as fromCompanySelectorActions from '../actions/';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class CompanySelectorEffects {
  @Effect()
  getCompanies$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanySelectorActions.GET_COMPANIES),
    switchMap((action: fromCompanySelectorActions.GetCompanies) =>
      this.companyApiService.getCompanyBaseInformation().pipe(
        map((companies: CompanyBaseInformation[]) => {
          const companiesTransformed = PayfactorsApiModelMapper.mapCompaniesResponseToCompanySelector(companies);
          return new fromCompanySelectorActions.GetCompaniesSuccess(companiesTransformed);
        }),
        catchError(error => of(new fromCompanySelectorActions.GetCompaniesError))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) { }
}
