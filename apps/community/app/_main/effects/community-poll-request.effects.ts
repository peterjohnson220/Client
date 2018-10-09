import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPollRequest } from 'libs/models/community/community-poll-request.model';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import * as fromCommunityPollRequestActions from '../actions/community-poll-request.actions';

@Injectable()
export class CommunityPollRequestEffects {

  @Effect()
  loadCommunityPollRequests$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollRequestActions.LOADING_COMMUNITY_POLL_REQUEST).pipe(
      switchMap(() =>
        this.communityPollService.getAllCommunityPollRequests().pipe(
          map((communityPollListItems: CommunityPollRequest[]) => {
            return new fromCommunityPollRequestActions.LoadingCommunityPollRequestsSuccess(communityPollListItems);
          }),
          catchError(error => of(new fromCommunityPollRequestActions.LoadingCommunityPollRequestsError()))
        )
      )
    );

  @Effect()
  submittingCommunityPollRequestResponse$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollRequestActions.SUBMITTING_COMMUNITY_POLL_REQUEST_RESPONSE).pipe(
      switchMap((action: fromCommunityPollRequestActions.SubmittingCommunityPollRequest) =>
        this.communityPollService.submitCommunityPollRequestResponse(action.payload).pipe(
          map((response: boolean) => {
              return new fromCommunityPollRequestActions.SubmittingCommunityPollRequestSuccess(response);
          }),
          catchError(error => of(new fromCommunityPollRequestActions.SubmittingCommunityPollRequestError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityPollService: CommunityPollApiService,
  ) {}
}
