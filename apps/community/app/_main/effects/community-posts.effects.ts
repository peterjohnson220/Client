import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import { CommunitySearchResult } from 'libs/models/community/community-search-result.model';
import { CommunityPost } from 'libs/models/community';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';
import { PagingOptions } from '../models/paging-options.model';

import * as fromCommunityPostFilterOptionsReducer from '../reducers';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';
import * as fromCommunityPostFilterReplyViewActions from '../actions/community-post-filter-reply-view.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';



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
      withLatestFrom(
        this.store.select(fromCommunityPostFilterOptionsReducer.getCommunityPostFilterOptions),
        (action: fromCommunityPostActions.GettingCommunityPosts, filters) => ({ action, filters })),
      mergeMap((communityPostContext) => {
        // TODO: modify paging options when implement infinte scroll
        const pagingOptions: PagingOptions = {
          StartIndex: 0,
          NumberOfPosts: 60
        };
        return this.communityPostService.getPosts({
          PagingOptions: pagingOptions,
          FilterOptions: communityPostContext.filters
        }).pipe(
          concatMap((communitySearchResult: CommunitySearchResult) => {
            const replyIds = communitySearchResult.FilteredReplies.map(reply => reply.Id);
            return [
              new fromCommunityPostFilterReplyViewActions.ClearingCommunityPostFilteredRepliesToView(communitySearchResult.FilteredReplies),
              new fromCommunityPostAddReplyViewActions.ClearingAllCommunityPostReplies(),
              new fromCommunityPostActions.GettingCommunityPostsSuccess(communitySearchResult.Posts),
              new fromCommunityPostReplyActions.GettingCommunityPostRepliesSuccess(communitySearchResult.FilteredReplies),
              new fromCommunityPostFilterReplyViewActions.AddingCommunityPostFilteredRepliesToView({ replyIds: replyIds })];
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsError()))
        );
      }
    ));


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
    private store: Store<fromCommunityPostFilterOptionsReducer.State>,
    private communityPostService: CommunityPostApiService,
    private communityPollService: CommunityPollApiService,
  ) {
  }
}
