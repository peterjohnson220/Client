import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CompanyJobApiService, CompanyJobPricingMatchApiService } from 'libs/data/payfactors-api';
import { Match } from 'libs/models/company';

import * as fromMatchesActions from '../actions/matches.actions';

@Injectable()
export class MatchesEffects {

  @Effect()
  getCompanyJobMatches$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromMatchesActions.LOADING),
      switchMap((action: fromMatchesActions.Loading ) =>
        this.companyJobApiService.getMatches(action.payload)
          .pipe(
            map((matches: Match[]) => new fromMatchesActions.LoadingSuccess(matches)),
            catchError(error => of(new fromMatchesActions.LoadingError()))
          )
        )
    );

  @Effect()
  updateExcludeFromParticipation$ = this.actions$
    .pipe(
      ofType(fromMatchesActions.UPDATE_EXCLUDE_FROM_PARTICIPATION),
      switchMap((action: fromMatchesActions.UpdateExcludeFromParticipation) =>
        this.companyJobPricingMatchApiService.updateExcludeFromParticipation(action.payload.CompanyJobPricingMatchIds,
          action.payload.ExcludeFromParticipation).pipe(
            map(() => new fromMatchesActions.UpdateExcludeFromParticipationSuccess()),
            catchError(error => of(new fromMatchesActions.UpdateExcludeFromParticipationError()))
        ))
    );

  constructor(
    private actions$: Actions,
    private companyJobApiService: CompanyJobApiService,
    private companyJobPricingMatchApiService: CompanyJobPricingMatchApiService
  ) {}
}
