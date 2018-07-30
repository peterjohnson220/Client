import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPoll } from 'libs/models/community/community-poll.model';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';
import * as fromCommunityPollActions from '../actions/community-poll.actions';

@Injectable()
export class CommunityPollEffects {

@Effect()
addCommunityPoll$: Observable<Action> = this.actions$
  .ofType(fromCommunityPollActions.ADDING_COMMUNITY_POLL).pipe(
    switchMap((action: fromCommunityPollActions.AddingCommunityPoll) =>
      this.communityPollService.addCommunityPoll(action.payload).pipe(
        map(() => {
          return new fromCommunityPollActions.AddingCommunityPollSuccess();
        }),
        catchError(error => of(new fromCommunityPollActions.AddingCommunityPollError(error)))
      )
    )
  );

  @Effect()
  updateCommunityPollStatus$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollActions.UPDATING_COMMUNITY_POLL_STATUS).pipe(
      switchMap((action: fromCommunityPollActions.UpdatingCommunityPollStatus) =>
        this.communityPollService.updateCommunityPollStatus(action.payload).pipe(
          map(() => {
            return new fromCommunityPollActions.UpdatingCommunityPollStatusSuccess();
          }),
          catchError(error => of(new fromCommunityPollActions.UpdatingCommunityPollStatusError(error)))
        )
      )
    );

  @Effect()
  loadCommunityPolls$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollActions.LOADING_COMMUNITY_POLLS).pipe(
      switchMap(() =>
        this.communityPollService.getAllCommunityPolls().pipe(
          map((communityPollListItems: CommunityPoll[]) => {
            return new fromCommunityPollActions.LoadingCommunityPollsSuccess(communityPollListItems);
          }),
          catchError(error => of(new fromCommunityPollActions.LoadingCommunityPollsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
     private communityPollService: CommunityPollApiService,
  ) {}
}
