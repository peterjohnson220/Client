import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, debounceTime, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromCommunityPostReducer from '../reducers';

import { CommunitySearchResult } from 'libs/models/community';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';

import * as fromCommunityPostFilterReplyViewActions from '../actions/community-post-filter-reply-view.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';

@Injectable()
export class CommunityPostEffectsService {
  searchCommunityPosts(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      debounceTime(200),
      withLatestFrom(
        this.store.select(fromCommunityPostReducer.getCommunityPostFilterOptions),
        this.store.select(fromCommunityPostReducer.getDiscussionPagingOptions),
        (action: fromCommunityPostActions.GettingCommunityPosts, filters, pagingOptions) =>
          ({ action, filters, pagingOptions })
      ),

      switchMap(search => {
        return this.communityPostService.getPosts({
          PagingOptions: search.pagingOptions,
          FilterOptions: search.filters
        }).pipe(
          concatMap((communitySearchResult: CommunitySearchResult) => {
            const replyIds = communitySearchResult.FilteredReplies.map(reply => reply.Id);

            const actions = [];
            actions.push(new fromCommunityPostFilterReplyViewActions
              .ClearingCommunityPostFilteredRepliesToView(communitySearchResult.FilteredReplies));
            actions.push(new fromCommunityPostAddReplyViewActions.ClearingAllCommunityPostReplies());

            if (search.action.type.toString() === fromCommunityPostActions.GETTING_NEXT_BATCH_COMMUNITY_POSTS) {
              actions.push(new fromCommunityPostActions.GettingNextBatchCommunityPostsSuccess(communitySearchResult));
            } else if (search.action.type.toString() === fromCommunityPostActions.GETTING_PREVIOUS_BATCH_COMMUNITY_POSTS) {
              actions.push(new fromCommunityPostActions.GettingPreviousBatchCommunityPostsSuccess(communitySearchResult));
            } else if (search.action.type.toString() === fromCommunityPostActions.GETTING_BACK_TO_TOP_COMMUNITY_POSTS) {
              actions.push(new fromCommunityPostActions.GettingBackToTopCommunityPostsSuccess(communitySearchResult));
            } else {
              actions.push(new fromCommunityPostActions.GettingCommunityPostsSuccess(communitySearchResult));
            }

            actions.push(new fromCommunityPostReplyActions.GettingCommunityPostRepliesSuccess(communitySearchResult.FilteredReplies));
            actions.push(new fromCommunityPostFilterReplyViewActions.AddingCommunityPostFilteredRepliesToView({ replyIds: replyIds }));

            return actions;
          }),
          catchError(error => of(new fromCommunityPostActions.GettingCommunityPostsError()))
        );
      })
    );
  }

  constructor(private store: Store<fromCommunityPostReducer.State>, private communityPostService: CommunityPostApiService) {
  }
}
