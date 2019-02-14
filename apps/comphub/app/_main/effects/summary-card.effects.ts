import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';

import { mergeMap } from 'rxjs/operators';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromSummaryCardActions from '../actions/summary-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromJobsCardActions from '../actions/jobs-card.actions';
import { ComphubPages } from '../data';

@Injectable()
export class SummaryCardEffects {

  @Effect()
  priceNewJob$ = this.actions$
    .ofType(fromSummaryCardActions.PRICE_NEW_JOB)
    .pipe(
      mergeMap(() => [
        new fromComphubPageActions.NavigateToCard({cardId: ComphubPages.Jobs }),
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromComphubPageActions.ResetPagesAccessed(),
        new fromJobsCardActions.ClearSelectedJob(),
        new fromMarketsCardActions.SetToDefaultPaymarket(),
        new fromDataCardActions.ClearSelectedJobData()
      ])
    );

  constructor(
    private actions$: Actions,
  ) {}
}
