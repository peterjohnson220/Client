import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import * as fromCommunityPollActions from '../actions/community-poll-request.actions';

@Injectable()
export class CommunityPollRequestEffects {

  @Effect()
  loadCommunityPollRequests$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollActions.LOADING_COMMUNITY_POLL_REQUEST).pipe(
      switchMap(() =>
        this.communityPollService.getAllCommunityPollRequests().pipe(
          map((communityPollListItems: CommunityPollRequest[]) => {
            return new fromCommunityPollActions.LoadingCommunityPollRequestsSuccess(communityPollListItems);
          }),
          catchError(error => of(new fromCommunityPollActions.LoadingCommunityPollRequestsError()))
        )
      )
    );

  @Effect()
  submittingCommunityPollRequestResponse$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollActions.SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE).pipe(
      switchMap((action: fromCommunityPollActions.SubmittingCommunityPollRequest) =>
        this.communityPollService.submitCommunityPollRequestResponse(action.payload).pipe(
          map((response: boolean) => {
              return new fromCommunityPollActions.SubmittingCommunityPollRequestSuccess(response);
          }),
          catchError(error => of(new fromCommunityPollActions.SubmittingCommunityPollRequestError()))
        )
      )
    );

    @Effect()
    loadCommunityPollResponses$: Observable<Action> = this.actions$
      .ofType(fromCommunityPollActions.LOADING_COMMUNITY_POLL_RESPONSES).pipe(
        switchMap(() =>
          this.communityPollService.getAllCommunityPollResponses().pipe(
            map((pollResponses: CommunityPollResponse[]) => {
              return new fromCommunityPollActions.LoadingCommunityPollResponsesSuccess(pollResponses);
            }),
            catchError(error => of(new fromCommunityPollActions.LoadingCommunityPollResponsesError()))
          )
        )
      );

  constructor(
    private actions$: Actions,
    private communityPollService: CommunityPollApiService,
  ) {}
}
