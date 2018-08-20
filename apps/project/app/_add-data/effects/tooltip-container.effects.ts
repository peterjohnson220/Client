import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api/surveys';
import { PricingMatchesDetailsRequest } from 'libs/models';

import * as fromTooltipContainerActions from '../actions/tooltip-container.actions';

@Injectable()
export class TooltipContainerEffects {
  @Effect()
  getMatchesDetails$ = this.actions$
    .ofType(fromTooltipContainerActions.GET_MATCHES_DETAILS)
    .pipe(
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
