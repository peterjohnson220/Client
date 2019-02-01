import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { IntegrationApiService } from 'libs/data/payfactors-api/integration';
import * as fromRootState from 'libs/state/state';
import * as fromCompositeSummaryDownloadActions from '../actions/composite-summary-download.actions';

@Injectable()
export class CompositeSummaryDownloadEffects {
  @Effect()
  compositeSummaryDownload$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCompositeSummaryDownloadActions.COMPOSITE_SUMMARY_DOWNLOAD),
      map(
        (action: fromCompositeSummaryDownloadActions.CompositeSummaryDownload) => action.payload),
        withLatestFrom(
          this.store.pipe(
            select(fromRootState.getUserContext),
          ),
          (request, userContext) => ({ request, userContext }),
        ),
      switchMap(
        ({ request, userContext }) => {
          return this.integrationApiService.compositeSummaryDownload(request, userContext);
        },
      ),
    );

  constructor(
    private actions$: Actions,
    private integrationApiService: IntegrationApiService,
    private store: Store<fromRootState.State>,
  ) {

  }
}

