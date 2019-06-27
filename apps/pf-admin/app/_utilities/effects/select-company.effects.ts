import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { CompanyListResponseModel } from 'libs/models/payfactors-api/company/response';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromSelectCompanyActions from '../actions/select-company.actions';
import * as fromUtilitiesReducer from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class SelectCompanyEffects {
  @Effect()
  loadCompaniesListIfEmpty$: Observable<Action> = this.actions$.pipe(
    ofType(fromSelectCompanyActions.LOAD_COMPANIES_LIST_IF_EMPTY),
    withLatestFrom(
      this.store.pipe(select(fromUtilitiesReducer.getCompaniesList)),
      (action, companiesList) => companiesList
    ),
    filter(companiesList => !companiesList.length),
    map(() => new fromSelectCompanyActions.LoadCompaniesList())
  );

  @Effect()
  loadCompaniesList: Observable<Action> = this.actions$.pipe(
    ofType(fromSelectCompanyActions.LOAD_COMPANIES_LIST),
    switchMap(() => {
      return this.companyApiService.getListOfCompanies().pipe(
        map((response: CompanyListResponseModel[]) =>  {
          return new fromSelectCompanyActions.LoadCompaniesListSuccess(
            PayfactorsApiModelMapper.mapCompanyListResponseToCompanyListItem(response)
          );
        }),
        catchError(() => of(new fromSelectCompanyActions.LoadCompaniesListError()))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private store: Store<fromUtilitiesReducer.State>
  ) {
  }
}
