import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPollResponse } from 'libs/models/community/community-poll-response.model';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import * as fromCommunityPollResponseActions from '../actions/community-poll-response.actions';

@Injectable()
export class CommunityPollResponseEffects {


  @Effect()
  loadCommunityPollResponses$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollResponseActions.LOADING_COMMUNITY_POLL_RESPONSES)
    .pipe(
      switchMap(() =>
        this.communityPollService.getAllCommunityPollResponses().pipe(
          map((pollResponses: CommunityPollResponse[]) => {
            return new fromCommunityPollResponseActions.LoadingCommunityPollResponsesSuccess(pollResponses);
          }),
          catchError(error => of(new fromCommunityPollResponseActions.LoadingCommunityPollResponsesError()))
        )
      )
    );

    @Effect()
    dismissingCommunityPollRequestResponse$: Observable<Action> = this.actions$
      .ofType(fromCommunityPollResponseActions.DISMISSING_COMMUNITY_POLL_RESPONSE).pipe(
        switchMap((action: fromCommunityPollResponseActions.DismissingCommunityPollResponse) =>
          this.communityPollService.dismissCommunityPollResponse(action.payload).pipe(
            map(() => {
                return new fromCommunityPollResponseActions.DismissingCommunityPollResponseSuccess();
            }),
            catchError(error => of(new fromCommunityPollResponseActions.DismissingCommunityPollResponseError()))
          )
        )
      );

  constructor(
    private actions$: Actions,
    private communityPollService: CommunityPollApiService,
  ) {}
}
