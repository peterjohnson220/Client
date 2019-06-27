import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyApiService } from 'libs/data/payfactors-api/company';
import { CompanyDto } from 'libs/models/company';

import * as fromPublicViewHeaderActions from '../actions/public-view-header.actions';
import * as fromPublicViewHeaderReducer from '../reducers';

@Injectable()
export class PublicViewHeaderEffects {
  @Effect()
  loadCompanyInformation$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPublicViewHeaderActions.LOAD_COMPANY_INFORMATION),
      switchMap((action: fromPublicViewHeaderActions.LoadCompanyInformation) =>
        this.companyApiService.get(action.payload.CompanyId).pipe(
          map((response: CompanyDto) => {
            return new fromPublicViewHeaderActions.LoadCompanyInformationSuccess(response);
          }),
          catchError(response => of(new fromPublicViewHeaderActions.LoadCompanyInformationError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService,
    private store: Store<fromPublicViewHeaderReducer.State>,
  ) {}
}
