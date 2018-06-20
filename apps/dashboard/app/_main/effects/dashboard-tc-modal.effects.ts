import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { TermsConditionsApiService } from 'libs/data/payfactors-api';
import { TermsConditionsModel} from 'libs/models';
import * as fromDashboardTCActions from '../actions/dashboard-tc-modal.actions';

@Injectable()
export class DashboardTcModalEffects {

  @Effect()
  TCData$ = this.actions$
    .ofType(fromDashboardTCActions.LOADING_TC).pipe(
      switchMap((action: fromDashboardTCActions.LoadingTermsAndConditions) =>
        this.termsConditionsApiService.getAwaitingTC(action.payload).pipe(
          map((tcData: TermsConditionsModel) => this.parseTCData(tcData)),
          map((tcData: TermsConditionsModel) => new fromDashboardTCActions.LoadingTermsAndConditionsSuccess(tcData)),
          catchError(error => of (new fromDashboardTCActions.LoadingTermsAndConditionsError(error)))
        )
      )
    );

  @Effect()
  submitTCResponse$: Observable<Action> = this.actions$
    .ofType(fromDashboardTCActions.SUBMITTING_TC).pipe(
      switchMap((action: fromDashboardTCActions.SubmittingTermsAndConditionsResponse) =>
        this.termsConditionsApiService.postTermsConditionsResponse(action.payload).pipe(
          map(() => new fromDashboardTCActions.SubmittingTermsAndConditionsResponseSuccess()),
          catchError(error => of (new fromDashboardTCActions.SubmittingTermsAndConditionsResponseError(error)))
        )
      )
    );


  constructor(
    private actions$: Actions,
    private termsConditionsApiService: TermsConditionsApiService
  ) {}

  parseTCData(model: any): TermsConditionsModel {
   return JSON.parse(model);
  }
}
