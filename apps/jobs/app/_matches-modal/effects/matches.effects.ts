import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import { CompanyJobApiService, CompanyJobPricingMatchApiService } from 'libs/data/payfactors-api';
import { Match } from 'libs/models/company';

import * as fromMatchesActions from '../actions/matches.actions';


@Injectable()
export class MatchesEffects {

  @Effect()
  getCompanyJobMatches$: Observable<Action> = this.actions$
    .ofType(fromMatchesActions.LOADING)
    .switchMap((action: fromMatchesActions.Loading ) =>
      this.companyJobApiService.getMatches(action.payload)
        .map((matches: Match[]) => new fromMatchesActions.LoadingSuccess(matches))
        .catch(error => of(new fromMatchesActions.LoadingError()))
    );

  @Effect()
  updateExcludeFromParticipation$ = this.actions$
    .ofType(fromMatchesActions.UPDATE_EXCLUDE_FROM_PARTICIPATION)
    .switchMap((action: fromMatchesActions.UpdateExcludeFromParticipation) =>
      this.companyJobPricingMatchApiService.updateExcludeFromParticipation(action.payload.CompanyJobPricingMatchIds,
        action.payload.ExcludeFromParticipation)
        .map(() => new fromMatchesActions.UpdateExcludeFromParticipationSuccess())
        .catch(error => of(new fromMatchesActions.UpdateExcludeFromParticipationError()))
    );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private companyJobPricingMatchApiService: CompanyJobPricingMatchApiService
  ) {}
}
