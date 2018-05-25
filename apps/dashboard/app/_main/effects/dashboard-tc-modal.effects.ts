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

import { TermsConditionsApiService } from 'libs/data/payfactors-api';
import { TermsConditionsModel} from 'libs/models';
import * as fromDashboardTCActions from '../actions/dashboard-tc-modal.actions';

@Injectable()
export class DashboardTcModalEffects {

  @Effect()
  TCData$ = this.actions$
    .ofType(fromDashboardTCActions.LOADING_TC)
    .switchMap((action: fromDashboardTCActions.LoadingTermsAndConditions) =>
      this.termsConditionsApiService
        .getAwaitingTC(action.payload)
        .map((tcData: TermsConditionsModel) => this.parseTCData(tcData))
        .map((tcData: TermsConditionsModel) => new fromDashboardTCActions.LoadingTermsAndConditionsSuccess(tcData))
        .catch(error => of (new fromDashboardTCActions.LoadingTermsAndConditionsError(error)))
    );

  @Effect()
  submitTCResponse$: Observable<Action> = this.actions$
    .ofType(fromDashboardTCActions.SUBMITTING_TC)
    .switchMap((action: fromDashboardTCActions.SubmittingTermsAndConditionsResponse) =>
      this.termsConditionsApiService.postTermsConditionsResponse(action.payload)
        .map(() => new fromDashboardTCActions.SubmittingTermsAndConditionsResponseSuccess())
        .catch(error => of (new fromDashboardTCActions.SubmittingTermsAndConditionsResponseError(error)))
    );


  constructor(
    private actions$: Actions,
    private termsConditionsApiService: TermsConditionsApiService
  ) {}

  parseTCData(model: any): TermsConditionsModel {
   return JSON.parse(model);
  }
}
