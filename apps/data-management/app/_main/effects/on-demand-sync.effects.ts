import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { OnDemandSyncHrisApiService } from 'libs/data/payfactors-api/hris-api';
import * as fromRootState from 'libs/state/state';

import * as fromOnDemandSyncActions from '../actions/on-demand-sync.actions';
import * as fromDataManagementMainReducer from '../reducers';

@Injectable()
export class OnDemandSyncEffects {
  @Effect()
  queueOnDemandSync$: Observable<Action> = this.actions$
    .pipe(
        ofType(fromOnDemandSyncActions.QUEUE_ON_DEMAND_SYNC),
        withLatestFrom(
          this.store.pipe(select(fromRootState.getUserContext)),
          this.store.pipe(select(fromDataManagementMainReducer.getHrisConnectionSummary)),
          (action, userContext, summary) => {
            return {
              action,
              userContext,
              summary,
            };
          }
        ),
        switchMap(obj => {
          return this.onDemandSyncService.queueOnDemandSync(obj.userContext, obj.summary.selectedEntities)
            .pipe(
              map(() => {
                return new fromOnDemandSyncActions.QueueOnDemandSyncSuccess();
              }),
              catchError(e => of(new fromOnDemandSyncActions.QueueOnDemandSyncError())),
            );
        }),
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromDataManagementMainReducer.State>,
    private onDemandSyncService: OnDemandSyncHrisApiService,
  ) {}
}
