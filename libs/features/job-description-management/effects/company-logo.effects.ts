import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyDto } from 'libs/models/company';
import { CompanyApiService } from 'libs/data/payfactors-api/company';

import * as fromJobDescriptionActions from 'libs/features/job-description-management/actions/';
import { CompanyLogo } from 'libs/features/job-description-management/models';

@Injectable()
export class CompanyLogoEffects {

    @Effect()
    loadCompanyLogo$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromJobDescriptionActions.LOAD_COMPANY_LOGO),
        switchMap((action: fromJobDescriptionActions.LoadCompanyLogo) => {
          return this.companyApiService.get(action.payload).pipe(
            map((response: CompanyDto) => {
              return new fromJobDescriptionActions.LoadCompanyLogoSuccess(response);
            }),
            catchError(response => of(new fromJobDescriptionActions.LoadCompanyLogoError()))
          );
        })
      );

      @Effect()
      loadCompanyLogos$: Observable<Action> = this.actions$
        .pipe(
          ofType(fromJobDescriptionActions.LOAD_AVAILABLE_COMPANY_LOGOS),
          switchMap((action: fromJobDescriptionActions.LoadAvailableCompanyLogos) => {
            return this.companyApiService.getCompanyLogos().pipe(
              map((response: CompanyLogo[]) => {
                return new fromJobDescriptionActions.LoadAvailableCompanyLogosSuccess(response);
              }),
              catchError(response => of(new fromJobDescriptionActions.LoadAvailableCompanyLogosError({
                error: 'Error loading logos.'
              })))
            );
          })
        );

  constructor(
    private actions$: Actions,
    private companyApiService: CompanyApiService
  ) {}
}
