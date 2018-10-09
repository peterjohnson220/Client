import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import { CommunityPost } from 'libs/models/community';
import * as fromCommunityPostActions from '../actions/community-post.actions';

@Injectable()
export class CommunityPostEffects {

  @Effect()
  submittingCommunityPost$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.SUBMITTING_COMMUNITY_POST).pipe(
      switchMap((action: fromCommunityPostActions.SubmittingCommunityPost) =>
        this.communityPostService.submitCommunityPost(action.payload).pipe(
          map((communityPost: CommunityPost) => {
            return new fromCommunityPostActions.SubmittingCommunityPostSuccess(communityPost);
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
          map((communityPosts: CommunityPost[]) => {
            return new fromCommunityPostActions.GettingCommunityPostsSuccess(communityPosts);
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsError()))
        )
      )
    );

  @Effect()
  updatingCommunityPostLike$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.UPDATING_COMMUNITY_POST_LIKE).pipe(
      switchMap((action: fromCommunityPostActions.UpdatingCommunityPostLike) =>
        this.communityPostService.updatePostLike(action.payload).pipe(
          map(() => {
            return new fromCommunityPostActions.UpdatingCommunityPostLikeSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostActions.UpdatingCommunityPostLikeError()))
        )
      )
    );

  @Effect()
  deletingCommunityPost$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.DELETING_COMMUNITY_POST).pipe(
      switchMap((action: fromCommunityPostActions.DeletingCommunityPost) =>
        this.communityPostService.updatePostDeletedFlag(action.payload).pipe(
          map(() => {
            return new fromCommunityPostActions.DeletingCommunityPostSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostActions.DeletingCommunityPostError()))
        )
      )
    );


  @Effect()
  addingCommunityUserPoll$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.ADDING_COMMUNITY_DISCUSSION_POLL).pipe(
      switchMap((action: fromCommunityPostActions.AddingCommunityDiscussionPoll) =>
        this.communityPollService.addCommunityUserPoll(action.payload).pipe(
          map((communityPost: CommunityPost) => {
            return new fromCommunityPostActions.AddingCommunityDiscussionPollSuccess(communityPost);
          }),
          catchError(error => of(new fromCommunityPostActions.AddingCommunityDiscussionPollError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService,
    private communityPollService: CommunityPollApiService,
  ) {}
}
