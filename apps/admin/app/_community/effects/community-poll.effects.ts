import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPollList } from 'libs/models/community/community-poll-list.model';
import { CommunityPollAdminApiService } from 'libs/data/payfactors-api/community/community-poll-admin-api.service';
import * as fromCommunityPollActions from '../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../reducers';

@Injectable()
export class CommunityPollEffects {

@Effect()
addCommunityPoll$: Observable<Action> = this.actions$
  .ofType(fromCommunityPollActions.ADDING_COMMUNITY_POLL).pipe(
    switchMap((action: fromCommunityPollActions.AddingCommunityPoll) =>
      this.communityPollAdminService.addCommunityPoll(action.payload).pipe(
        map(() => {
          this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());
          return new fromCommunityPollActions.AddingCommunityPollSuccess();
        }),
        catchError(error => of(new fromCommunityPollActions.AddingCommunityPollError(error)))
      )
    )
  );

@Effect()
editCommunityPoll$: Observable<Action> = this.actions$
  .ofType(fromCommunityPollActions.EDITING_COMMUNITY_POLL).pipe(
    switchMap((action: fromCommunityPollActions.EditingCommunityPoll) =>
      this.communityPollAdminService.editCommunityPoll(action.payload).pipe(
        map(() => {
          this.store.dispatch(new fromCommunityPollActions.LoadingCommunityPolls());
          return new fromCommunityPollActions.EditingCommunityPollSuccess();
        }),
        catchError(error => of(new fromCommunityPollActions.EditingCommunityPollError(error)))
      )
    )
  );

  @Effect()
  loadCommunityPolls$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollActions.LOADING_COMMUNITY_POLLS).pipe(
      switchMap(() =>
        this.communityPollAdminService.getAllCommunityPolls().pipe(
          map((communityPollListItems: CommunityPollList[]) => {
            return new fromCommunityPollActions.LoadingCommunityPollsSuccess(communityPollListItems);
          }),
          catchError(error => of(new fromCommunityPollActions.LoadingCommunityPollsError()))
        )
      )
    );

  @Effect()
  exportCommunityPoll$: Observable<Action> = this.actions$
  .ofType(fromCommunityPollActions.EXPORTING_COMMUNITY_POLL).pipe(
    switchMap((action: fromCommunityPollActions.ExportingCommunityPoll) =>
      this.communityPollAdminService.exportCommunityPoll(action.payload).pipe(
        map((data) => {
          return new fromCommunityPollActions.ExportingCommunityPollSuccess(data);
        }),
        catchError(error => of(new fromCommunityPollActions.ExportingCommunityPollError(error)))
      )
    )
  );

  constructor(
    private actions$: Actions,
     private communityPollAdminService: CommunityPollAdminApiService,
     private store: Store<fromCommunityPollReducer.State>
  ) {}
}
