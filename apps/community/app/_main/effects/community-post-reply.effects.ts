import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { concatMap, switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityReply, CommunityCategoryEnum } from 'libs/models/community';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';
import * as fromCommunityCategoriesActions from '../actions/community-categories.actions';

@Injectable()
export class CommunityPostReplyEffects {

  @Effect()
  updatingCommunityPostReplyLike$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostReplyActions.UPDATING_COMMUNITY_POST_REPLY_LIKE),
      switchMap((action: fromCommunityPostReplyActions.UpdatingCommunityPostReplyLike) =>
        this.communityPostService.updatePostReplyLike(action.payload).pipe(
          map(() => {
            return new fromCommunityPostReplyActions.UpdatingCommunityPostReplyLikeSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostReplyActions.UpdatingCommunityPostReplyLikeError()))
        )
      )
    );

  @Effect()
  addingReply$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostReplyActions.ADDING_COMMUNITY_POST_REPLY),
      switchMap((action: fromCommunityPostReplyActions.AddingCommunityPostReply) =>
        this.communityPostService.addReply(action.payload).pipe(
          concatMap((reply: CommunityReply) => {
            if (reply.IsOnlyPostReply ) {
            return [
              new fromCommunityPostReplyActions.AddingCommunityPostReplySuccess(reply),
              new fromCommunityPostAddReplyViewActions.AddingCommunityPostReplyToView({ replyId:  reply.Id}),
              new fromCommunityCategoriesActions.SubtractingCommunityPostToCategoriesCount(
                { communityCategory: CommunityCategoryEnum.Unanswered })
            ];
          } else {
            return [
              new fromCommunityPostReplyActions.AddingCommunityPostReplySuccess(reply),
              new fromCommunityPostAddReplyViewActions.AddingCommunityPostReplyToView({ replyId:  reply.Id})
            ];
          }
          }),
          catchError(error => of(new fromCommunityPostReplyActions.AddingCommunityPostReplyError()))
        )
      )
    );

  @Effect()
  loadingCommunityPostReplies$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostReplyActions.GETTING_COMMUNITY_POST_REPLIES),
      switchMap((action: fromCommunityPostReplyActions.GettingCommunityPostReplies) =>
        this.communityPostService.getRepliesByPostId(action.payload).pipe(
          concatMap((replies: CommunityReply[]) => {
            const postId = replies[0].PostId;
            const replyIds = replies.map(reply => reply.Id);
            return [
              new fromCommunityPostReplyActions.GettingCommunityPostRepliesSuccess(replies),
              new fromCommunityPostActions.UpdatingCommunityPostReplyIds({ postId: postId, replyIds: replyIds })
            ];
          }),
          catchError(() => of(new fromCommunityPostReplyActions.GettingCommunityPostRepliesError())))
      )
    );

  @Effect()
  deletingCommunityPostReplyLike$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostReplyActions.DELETING_COMMUNITY_POST_REPLY),
      switchMap((action: fromCommunityPostReplyActions.DeletingCommunityPostReply) =>
        this.communityPostService.updatePostReplyDeletedFlag(action.payload).pipe(

          concatMap((numberOfPostReplies: any) => {
            if ( numberOfPostReplies > 0) {
            return [
              new fromCommunityPostReplyActions.DeletingCommunityPostReplySuccess(action.payload),
            ];
            } else {
              return [
                new fromCommunityPostReplyActions.DeletingCommunityPostReplySuccess(action.payload),
                new fromCommunityCategoriesActions.AddingCommunityPostToCategoriesCount(
                  { communityCategory: CommunityCategoryEnum.Unanswered })
              ];
            }
          }),
          catchError(error => of(new fromCommunityPostReplyActions.DeletingCommunityPostReplyError()))
        )
      )
    );

  @Effect()
  savingCmmunityPostReplyEdit$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityPostReplyActions.SAVING_COMMUNITY_POST_REPLY_EDIT),
      switchMap((action: fromCommunityPostReplyActions.SavingCommunityPostReplyEdit) =>
        this.communityPostService.updateReply(action.payload).pipe(
          map(() => {
            return new fromCommunityPostReplyActions.SavingCommunityPostReplyEditSuccess(action.payload);
          }),
          catchError(error => of(new fromCommunityPostReplyActions.SavingCommunityPostReplyEditError()))
        )
      )
    );


  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService,
  ) {}
}
