import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { Permissions } from 'libs/constants';
import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyBaseInformation } from 'libs/models/company';

import * as fromCompanySelectorActions from '../actions';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromReducers from '../reducers';

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

  @Effect()
  companyHasBenefits$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanySelectorActions.COMPANY_HAS_BENEFITS),
    withLatestFrom(
      this.store.select(fromReducers.getSelectedCompany),
      (action, selectedCompany) => {
        return { action, selectedCompany };
      }
    ),
    switchMap(payload => {
      return this.companyApiService.companyHasTile(payload.selectedCompany.CompanyId, Permissions.TOTAL_REWARDS).pipe(
        map((response: any) => {
          return new fromCompanySelectorActions.CompanyHasBenefitsSuccess(response.CompanyHasTile);
        }),
        catchError(() => of(new fromCompanySelectorActions.GetCompaniesError()))
      );
    })
  );

  @Effect()
  isValidCompanyRepository$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanySelectorActions.IS_VALID_COMPANY_REPOSITORY),
    switchMap((action: fromCompanySelectorActions.IsValidCompanyRepository) =>
      this.companyApiService.isValidCompanyRepository(action.payload).pipe(
        map((response: any) => {
          return new fromCompanySelectorActions.IsValidCompanyRepositorySuccess(response.IsValidCompanyRepository);
        }),
        catchError(error => of(new fromCompanySelectorActions.GetCompaniesError))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private store: Store<fromReducers.State>,
  ) { }
}
