import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
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

  @Effect()
  exportCommunityPoll$: Observable<Action> = this.actions$
    .ofType(fromCommunityPollResponseActions.EXPORTING_COMMUNITY_USER_POLL_RESPONSES).pipe(
      switchMap((action: fromCommunityPollResponseActions.ExportingCommunityUserPollResponses) =>
        this.communityPollService.exportCommunityUserPoll(action.payload).pipe(
          map((data) => {
            return new fromCommunityPollResponseActions.ExportingCommunityUserPollResponsesSuccess();
          }),
          catchError(error => of(new fromCommunityPollResponseActions.ExportingCommunityUserPollResponsesError()))
        )
      )
    );


  constructor(
    private actions$: Actions,
    private communityPollService: CommunityPollApiService,
  ) {}
}
