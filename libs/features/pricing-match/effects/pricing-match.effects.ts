import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs/index';
import { catchError, map, switchMap } from 'rxjs/operators';

import { PricingMatchApiService } from '../../../data/payfactors-api/pricing';

import * as fromPricingMatchActions from '../actions/pricing-match.actions';


@Injectable()
export class PricingMatchEffects {
  constructor(private actions$: Actions,
              private pricingMatchService: PricingMatchApiService) {
  }

  @Effect()
  getPricingMatchSummary$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingMatchActions.LOAD_PRICING_MATCH),
      switchMap(
        (action: fromPricingMatchActions.LoadPricingMatch) =>
          this.pricingMatchService.getPricingMatchSummary(action.payload.pricingMatchId).pipe(
            map((response: any) => {
              return new fromPricingMatchActions.LoadPricingMatchSuccess(response);
            }),
            catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
          )
      )
    );
}
