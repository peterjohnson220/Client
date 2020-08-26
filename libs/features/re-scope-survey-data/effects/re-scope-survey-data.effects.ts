import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { PricingApiService } from '../../../data/payfactors-api/pricing';

import * as fromReScopeSurveyDataActions from '../actions/re-scope-survey-data.actions';


@Injectable()
export class ReScopeSurveyDataEffects {
  constructor(private actions$: Actions, private pricingService: PricingApiService) {}

  @Effect()
  getReScopeContext$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromReScopeSurveyDataActions.GET_RE_SCOPE_SURVEY_DATA_CONTEXT),
      switchMap((action: fromReScopeSurveyDataActions.GetReScopeSurveyDataContext) => {
        return this.pricingService.getReScopeSurveyDataContext(action.payload).pipe(
          map((response: any) => {
            return new fromReScopeSurveyDataActions.GetReScopeSurveyDataContextSuccess(response);
          }),
          catchError(response => of(new fromReScopeSurveyDataActions.ReScopeSurveyDataError(response)))
        );
      })
    );
}
