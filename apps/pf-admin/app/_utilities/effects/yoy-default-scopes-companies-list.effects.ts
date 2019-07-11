import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromYoyDefaultScopesCompaniesListActions from '../actions/yoy-default-scopes-companies-list.actions';
import { CompanyGridItem } from '../../_companies/models';

@Injectable()
export class YoyDefaultScopesCompaniesListEffects {

  @Effect()
  loadYoyDefaultScopesCompanies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromYoyDefaultScopesCompaniesListActions.LOAD_YOY_DEFAULT_SCOPES_COMPANIES_LIST),
      switchMap(() => {
        return this.companyApiService.getListOfCompanies().pipe(
          map((response: CompanyGridItem[]) => {
            return new fromYoyDefaultScopesCompaniesListActions.LoadYoyDefaultScopesCompaniesSuccess(response);
          })
        );
      })
    );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) { }
}
