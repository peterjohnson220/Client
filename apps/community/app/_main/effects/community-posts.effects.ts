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
  updatingCommunityPostReplyLike$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.UPDATING_COMMUNITY_POST_REPLY_LIKE).pipe(
      switchMap((action: fromCommunityPostActions.UpdatingCommunityPostReplyLike) =>
        this.communityPostService.updatePostReplyLike(action.payload).pipe(
          map(() => {
            return new fromCommunityPostActions.UpdatingCommunityPostReplyLikeSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostActions.UpdatingCommunityPostReplyLikeError()))
        )
      )
    );

  @Effect()
  addingReply$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.ADDING_COMMUNITY_POST_REPLY).pipe(
      switchMap((action: fromCommunityPostActions.AddingCommunityPostReply) =>
        this.communityPostService.addReply(action.payload).pipe(
          map((response) => {
            return new fromCommunityPostActions.AddingCommunityPostReplySuccess(response);
          }),
          catchError(error => of(new fromCommunityPostActions.AddingCommunityPostReplyError()))
        )
      )
    );

  @Effect()
  loadingCommunityPostReplies$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.GETTING_COMMUNITY_POST_REPLIES).pipe(
      switchMap((action: fromCommunityPostActions.GettingCommunityPostReplies) =>
        this.communityPostService.getReplies(action.payload).pipe(
          map((response: boolean) => {
            return new fromCommunityPostActions.GettingCommunityPostRepliesSuccess(response);
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostRepliesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService,
  ) {}
}
