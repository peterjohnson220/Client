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
        map((communityPoll: CommunityPoll) => {
          return new fromCommunityPollActions.AddingCommunityPollSuccess(communityPoll);
        }),
        catchError(error => of(new fromCommunityPollActions.AddingCommunityPollError(error)))
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
