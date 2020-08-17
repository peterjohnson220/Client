import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, concatMap} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityPollApiService } from 'libs/data/payfactors-api/community/community-poll-api.service';

import { CommunityPost } from 'libs/models/community';
import { CommunityCategoryEnum } from 'libs/models/community/community-category.enum';


import * as fromCommunityPostFilterOptionsReducer from '../reducers';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';
import * as fromCommunityAttachmentActions from '../actions/community-attachment.actions';

import { CommunityPostEffectsService } from '../services/community-post-effects-service';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';


@Injectable()
export class CommunityPostEffects {

  @Effect()
  submittingCommunityPost$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostActions.SUBMITTING_COMMUNITY_POST),
      switchMap((action: fromCommunityPostActions.SubmittingCommunityPost) =>
        this.communityPostService.submitCommunityPost(action.payload).pipe(
          concatMap((communityPost: CommunityPost) => {
            if (communityPost.IsInternalOnly) {
              return [
                new fromCommunityPostActions.SubmittingCommunityPostSuccess(communityPost),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                    { communityCategory: CommunityCategoryEnum.MyFavorites }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Internal }),
                new fromCommunityAttachmentActions.ClearCommunityAttachmentsState(CommunitySearchResultTypeEnum.Discussion)
              ];
            }  else {
              return [
                new fromCommunityPostActions.SubmittingCommunityPostSuccess(communityPost),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyPosts }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.MyFavorites }),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered }),
                new fromCommunityAttachmentActions.ClearCommunityAttachmentsState(CommunitySearchResultTypeEnum.Discussion)
              ];
            }
          }),
          catchError(error => of(new fromCommunityPostActions.SubmittingCommunityPostError()))
        )
      )
    );

  @Effect()
  loadingCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.pipe(ofType(fromCommunityPostActions.GETTING_COMMUNITY_POSTS))
  );

  @Effect()
  loadingNextBatchCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.pipe(ofType(fromCommunityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS))
  );

  @Effect()
  loadingPreviousBatchCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.pipe(ofType(fromCommunityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS))
  );

  @Effect()
  gettingBackToTopCommunityPosts = this.communityPostEffectsService.searchCommunityPosts(
    this.actions$.pipe(ofType(fromCommunityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS))
  );

  @Effect()
  updatingCommunityPostLike$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostActions.UPDATING_COMMUNITY_POST_LIKE),
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
    updatingCommunityPostFavorite$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromCommunityPostActions.UPDATING_COMMUNITY_POST_FAVORITE),
        switchMap((action: fromCommunityPostActions.UpdatingCommunityPostFavorite) =>
          this.communityPostService.updatePostFavorite(action.payload).pipe(
            map(() => {
              return new fromCommunityPostActions.UpdatingCommunityPostFavoriteSuccess(action.payload);
            }),
            catchError(error => of(new fromCommunityPostActions.UpdatingCommunityPostFavoriteError()))
          )
        )
      );
  @Effect()
  savingCmmunityPostEdit$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostActions.SAVING_COMMUNITY_POST_EDIT),
      switchMap((action: fromCommunityPostActions.SavingCommunityPostEdit) =>
        this.communityPostService.updatePost(action.payload).pipe(
          map(() => {
            return new fromCommunityPostActions.SavingCommunityPostEditSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostActions.SavingCommunityPostEditError()))
        )
      )
    );

  @Effect()
  deletingCommunityPost$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostActions.DELETING_COMMUNITY_POST),
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
                  { communityCategory: CommunityCategoryEnum.MyFavorites }),
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
    .pipe(
      ofType(fromCommunityPostActions.ADDING_COMMUNITY_DISCUSSION_POLL),
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

  @Effect()
  gettingCommunityPost$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostActions.GETTING_COMMUNITY_POST),
      switchMap((action: fromCommunityPostActions.GettingCommunityPost) =>
        this.communityPostService.getPost(action.payload).pipe(
          map((post: CommunityPost) => {
            return new fromCommunityPostActions.GettingCommunityPostSuccess(post);
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostError()))
        )
      )
    );

    @Effect()
    disardingPostAttachments$: Observable<Action> = this.actions$
      .pipe(
        ofType(fromCommunityAttachmentActions.DISCARD_ATTACHMENTS),
        switchMap((action: fromCommunityAttachmentActions.DiscardAttachments) =>
          this.communityPostService.deleteCommunityAttachments(action.payload).pipe(
            map(() => {
              return new fromCommunityAttachmentActions.DiscardAttachmentsSuccess();
            }),
            catchError(error => of(new fromCommunityAttachmentActions.DiscardAttachmentsError()))
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
