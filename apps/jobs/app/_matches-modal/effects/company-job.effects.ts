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
import {catchError, map, switchMap} from 'rxjs/operators';

import { CompanyJobApiService } from 'libs/data/payfactors-api';
import { CompanyJob } from 'libs/models/company';

import * as fromCompanyJobActions from '../actions/company-job.actions';


@Injectable()
export class CompanyJobEffects {

  @Effect()
  getCompanyJob$: Observable<Action> = this.actions$
    .ofType(fromCompanyJobActions.LOADING)
    .switchMap((action: fromCompanyJobActions.Loading) =>
      this.companyJobApiService.getCompanyJobTitleAndCode(action.payload)
        .map((companyJob: CompanyJob) => new fromCompanyJobActions.LoadingSuccess(companyJob))
        .catch(error => of(new fromCompanyJobActions.LoadingError()))
    );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
