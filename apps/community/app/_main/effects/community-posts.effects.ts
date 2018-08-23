import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';

import * as fromCommunityPostActions from '../actions/community-post.actions';

@Injectable()
export class CommunityPostEffects {

  @Effect()
  submittingCommunityPost$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.SUBMITTING_COMMUNITY_POST).pipe(
      switchMap((action: fromCommunityPostActions.SubmittingCommunityPost) =>
        this.communityPostService.submitCommunityPost(action.payload).pipe(
          map((response: boolean) => {
            return new fromCommunityPostActions.SubmittingCommunityPostSuccess(response);
          }),
          catchError(error => of(new fromCommunityPostActions.SubmittingCommunityPostError()))
        )
      )
    );

  @Effect()
  loadingCommunityPosts$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.GETTING_COMMUNITY_POSTS).pipe(
      switchMap(() =>
        this.communityPostService.getPosts().pipe(
          map((response: boolean) => {
            return new fromCommunityPostActions.GettingCommunityPostsSuccess(response);
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService,
  ) {}
}
