import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { concatMap, switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';
import { CommunityReply } from 'libs/models/community';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';

@Injectable()
export class CommunityPostReplyEffects {

  @Effect()
  updatingCommunityPostReplyLike$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostReplyActions.UPDATING_COMMUNITY_POST_REPLY_LIKE).pipe(
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
    .ofType(fromCommunityPostReplyActions.ADDING_COMMUNITY_POST_REPLY).pipe(
      switchMap((action: fromCommunityPostReplyActions.AddingCommunityPostReply) =>
        this.communityPostService.addReply(action.payload).pipe(
          concatMap((reply: CommunityReply) => {
            return [
              new fromCommunityPostReplyActions.AddingCommunityPostReplySuccess(reply),
              new fromCommunityPostAddReplyViewActions.AddingCommunityPostReplyToView({ replyId:  reply.Id})
            ];
          }),
          catchError(error => of(new fromCommunityPostReplyActions.AddingCommunityPostReplyError()))
        )
      )
    );

  @Effect()
  loadingCommunityPostReplies$: Observable<Action> = this.actions$
    .ofType(fromCommunityPostReplyActions.GETTING_COMMUNITY_POST_REPLIES).pipe(
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


  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService,
  ) {}
}
