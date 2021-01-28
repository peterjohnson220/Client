import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CompanyJobApiService } from 'libs/data/payfactors-api/company';
import * as fromCompanyFlsaStatusActions from 'libs/features/jobs/job-description-management/actions/company-flsa-status.actions';

@Injectable()
export class CompanyFlsaStatusEffects {
  @Effect()
  loadCompanyFlsaStatuses$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompanyFlsaStatusActions.LOAD_COMPANY_FLSA_STATUSES),
      switchMap((action: fromCompanyFlsaStatusActions.LoadCompanyFlsaStatuses) =>
        this.companyJobApiService.getCompanyFLSAStatuses().pipe(
          map((response: string[]) => {
            return new fromCompanyFlsaStatusActions.LoadCompanyFlsaStatusesSuccess(response);
          }),
          catchError(response => of(new fromCompanyFlsaStatusActions.LoadCompanyFlsaStatusesError()))
        )
      ));

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService
  ) {}
}
