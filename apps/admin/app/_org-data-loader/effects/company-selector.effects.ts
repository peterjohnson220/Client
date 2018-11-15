import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { Company } from 'libs/models/company/company.model';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromCompanySelectorActions from '../actions/company-selector.actions';

@Injectable()
export class CompanySelectorEffects {

  @Effect()
  loadCompanies$: Observable<Action> = this.actions$
    .ofType(fromCompanySelectorActions.LOADING_COMPANIES)
    .switchMap(() =>
      this.companyApiService.getCompanies()
        .map((companies: Company[]) => new fromCompanySelectorActions.LoadingCompaniesSuccess(companies))
        .catch(error => of(new fromCompanySelectorActions.LoadingCompaniesError()))
    );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) {}
}
