import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import { Observable, of } from 'rxjs/index';
import { catchError, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';

import { PricingMatchEntityTypes } from 'libs/constants';

import * as fromPricingMatchActions from '../actions';
import * as fromPricingMatchReducer from '../reducers';
import * as fromSurveySearchReducer from '../../../surveys/survey-search/reducers';
import { PricingMatchApiService } from '../../../../data/payfactors-api/pricing';

@Injectable()
export class PricingMatchEffects {
  constructor(private actions$: Actions,
              private pricingMatchService: PricingMatchApiService,
              private store: Store<fromPricingMatchReducer.State>) {
  }

  @Effect()
  getPricingMatchSummary$: Observable<Action> = this.actions$.pipe(
    ofType<fromPricingMatchActions.LoadPricingMatch>(fromPricingMatchActions.LOAD_PRICING_MATCH),
    filter(action => action.payload.entityType !== PricingMatchEntityTypes.CustomPeerCutId),
    switchMap((action: fromPricingMatchActions.LoadPricingMatch) => {
        return this.pricingMatchService.getPricingMatchSummary(action.payload.entityId, action.payload.entityType).pipe(
          map((response: any) => new fromPricingMatchActions.LoadPricingMatchSuccess(response)),
          catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
        );
      }
    )
  );
  
  @Effect()
  getPricingMatchSummaryForCustomScope$: Observable<Action> = this.actions$.pipe(
    ofType<fromPricingMatchActions.LoadPricingMatch>(fromPricingMatchActions.LOAD_PRICING_MATCH),
    filter(action => action.payload.entityType === PricingMatchEntityTypes.CustomPeerCutId),
    withLatestFrom(
      this.store.pipe(select(fromSurveySearchReducer.getTempExchangeJobDataCutFilterContextDictionary)),
      (action: fromPricingMatchActions.LoadPricingMatch, filterContextDictionary) =>
        ({action, filterContextDictionary})
    ),
    switchMap((data: any) => {
        const request = data.filterContextDictionary[data.action.payload.entityId];
        return this.pricingMatchService.getPricingMatchSummaryForCustomScope(request).pipe(
          map((response: any) => new fromPricingMatchActions.LoadPricingMatchSuccess(response)),
          catchError(response => of(new fromPricingMatchActions.GetPricingMatchError()))
        );
      }
    )
  );
}
