import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import { CommunityPost } from 'libs/models/community';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';


import * as fromCommunityPostFilterOptionsReducer from '../reducers';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';
import { CommunityPostEffectsService } from '../services/community-post-effects-service';


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
  loadingCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.ofType(fromCommunityPostActions.GETTING_COMMUNITY_POSTS)
  );

  @Effect()
  loadingNextBatchCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.ofType(fromCommunityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS)
  );

  @Effect()
  loadingPreviousBatchCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.ofType(fromCommunityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS)
  );

  @Effect()
  gettingBackToTopCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.ofType(fromCommunityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS)
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
            let actions: Action[];
            if (action.payload.IsInternalOnly) {
              actions =
              [
                new fromCommunityPostActions.DeletingCommunityPostSuccess(action.payload.PostId),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Internal })
              ];
            } else {
              actions = [
                new fromCommunityPostActions.DeletingCommunityPostSuccess(action.payload.PostId),
                new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts })
              ];
            }
            if (!action.payload.IsUserPoll && !action.payload.HasReplies) {
              actions.push( new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                { communityCategory: CommunityCategoryEnum.Unanswered }));
            }
            return actions;
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
          concatMap((communityPost: CommunityPost) => {
            return [
              new fromCommunityPostActions.AddingCommunityDiscussionPollSuccess(communityPost),
              new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                { communityCategory: CommunityCategoryEnum.MyPosts })
            ];
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
    private communityPostEffectsService: CommunityPostEffectsService
  ) {
  }
}
