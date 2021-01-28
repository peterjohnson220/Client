import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/search';
import { PricingMatchesDetailsRequest } from 'libs/models/payfactors-api';

import * as fromTooltipContainerActions from '../actions/tooltip-container.actions';

@Injectable()
export class TooltipContainerEffects {
  @Effect()
  getMatchesDetails$ = this.actions$
    .pipe(
      ofType(fromTooltipContainerActions.GET_MATCHES_DETAILS),
      map((action: fromTooltipContainerActions.GetMatchesDetails) => action.payload),
      switchMap((matchesDetailsRequest: PricingMatchesDetailsRequest) => {
        return this.surveySearchApiService.getPricingMatchesDetails(matchesDetailsRequest)
        .pipe(
          map((data: string[]) => new fromTooltipContainerActions.GetMatchesDetailsSuccess(data))
        );
      })
    );

  constructor(
    private actions$: Actions,
    private surveySearchApiService: SurveySearchApiService
  ) {}
}
