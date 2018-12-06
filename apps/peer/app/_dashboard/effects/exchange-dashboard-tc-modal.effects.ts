import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { TermsConditionsApiService } from 'libs/data/payfactors-api';
import { TermsConditionsModel } from 'libs/models';

import * as fromExchangeDashboardTCActions from '../actions/exchange-dashboard-tc-modal.actions';

@Injectable()
export class ExchangeDashboardTCModalEffects {

  @Effect()
  TCData$ = this.actions$.pipe(
    ofType(fromExchangeDashboardTCActions.LOAD_TC),
      switchMap((action: fromExchangeDashboardTCActions.LoadTermsAndConditions) =>
        this.termsConditionsApiService.getAwaitingTC(action.payload).pipe(
          map((tcData: TermsConditionsModel) => new fromExchangeDashboardTCActions.LoadTermsAndConditionsSuccess(tcData)),
          catchError(error => of (new fromExchangeDashboardTCActions.LoadTermsAndConditionsError(error)))
        )
      )
    );

  @Effect()
  submitTCResponse$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeDashboardTCActions.SUBMIT_TC),
      switchMap((action: fromExchangeDashboardTCActions.SubmitTermsAndConditionsResponse) =>
        this.termsConditionsApiService.postTermsConditionsResponse(action.payload).pipe(
          map(() => new fromExchangeDashboardTCActions.SubmitTermsAndConditionsResponseSuccess()),
          catchError(error => of (new fromExchangeDashboardTCActions.SubmitTermsAndConditionsResponseError(error)))
        )
      )
    );


  constructor(
    private actions$: Actions,
    private termsConditionsApiService: TermsConditionsApiService
  ) {}
}
