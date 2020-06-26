import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyApiService } from '../../../../data/payfactors-api/company';
import * as fromCompanyDescriptionActions from '../actions/company-detail.actions';

@Injectable()
export class CompanyDetailEffects {
  @Effect()
  getCompanyDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyDescriptionActions.GET_COMPANY_DESCRIPTION),
    switchMap((action: fromCompanyDescriptionActions.GetCompanyDescription) =>
      this.companyApiService.getCompanyDescription(action.payload).pipe(
        map((description: string) => {
          return new fromCompanyDescriptionActions.GetCompanyDescriptionSuccess(description);
        }),
        catchError(error => of(new fromCompanyDescriptionActions.GetCompanyDescriptionError))
      )
    )
  );

  @Effect()
  getSubsidiaryDescription$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyDescriptionActions.GET_SUBSIDIARY_DESCRIPTION),
    switchMap((action: fromCompanyDescriptionActions.GetSubsidiaryDescription) =>
      this.companyApiService.getSubsidiaryDescription(action.payload).pipe(
        map((description: string) => {
          return new fromCompanyDescriptionActions.GetSubsidiaryDescriptionSuccess(description);
        }),
        catchError(error => of(new fromCompanyDescriptionActions.GetSubsidiaryDescriptionError))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) { }
}
