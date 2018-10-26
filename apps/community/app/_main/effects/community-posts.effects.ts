import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap } from 'rxjs/operators';

import * as cloneDeep from 'lodash.clonedeep';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import { CommunityPost } from 'libs/models/community';

import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';
import * as fromCommunityPostFilterReplyActions from '../actions/community-post-filter-reply-view.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';

@Injectable()
export class CommunityPostEffects {

  @Effect()
  submittingCommunityPost$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.SUBMITTING_COMMUNITY_POST).pipe(
      switchMap((action: fromCommunityPostActions.SubmittingCommunityPost) =>
        this.communityPostService.submitCommunityPost(action.payload).pipe(
          concatMap((communityPost: CommunityPost) => {
            if (communityPost.IsInternalOnly) {
              return [
                new fromCommunityPostActions.SubmittingCommunityPostSuccess(communityPost),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Internal })
              ];
            }  else {
              return [
                new fromCommunityPostActions.SubmittingCommunityPostSuccess(communityPost),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered })
              ];
            }
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
          concatMap((communityPosts: CommunityPost[]) => {
            return [
              new fromCommunityPostFilterReplyActions.ClearingCommunityPostFilteredRepliesToView(communityPosts),
              new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies(communityPosts),
              new fromCommunityPostActions.GettingCommunityPostsSuccess(communityPosts) ];
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsError()))
        )
      )
    );

  @Effect()
  loadingCommunityPostsByTag$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostActions.GETTING_COMMUNITY_POSTS_BY_TAG).pipe(
      switchMap((action: fromCommunityPostActions.GettingCommunityPostsByTag) =>
        this.communityPostService.getPostsByTag(action.payload).pipe(
          concatMap((communityPosts: CommunityPost[]) => {
            const replies = [];

            communityPosts.forEach(post => {
              post.FilteredReplies.forEach(reply => {
                replies.push(cloneDeep(reply));
              });
            });

            const replyIds = replies.map(reply => reply.Id);

            return [
              new fromCommunityPostActions.GettingCommunityPostsByTagSuccess(communityPosts),
              new fromCommunityPostReplyActions.GettingCommunityPostRepliesSuccess(replies),
              new fromCommunityPostFilterReplyActions.AddingCommunityPostFilteredRepliesToView({ replyIds: replyIds }),
              new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies(communityPosts),
            ];
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsByTagError()))
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
        this.communityPostService.updatePostDeletedFlag({ postId: action.payload.PostId }).pipe(
          concatMap(() => {
            if (action.payload.IsInternalOnly) {
              return [
                new fromCommunityPostActions.DeletingCommunityPostSuccess(action.payload.PostId),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered }),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Internal })
              ];
            } else {
              return [
                new fromCommunityPostActions.DeletingCommunityPostSuccess(action.payload.PostId),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered })
              ];
            }
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
  ) {
  }
}
