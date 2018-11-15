import { Injectable } from '@angular/core';
import { mapResultsPagingOptionsToPagingOptions } from '../helpers/model-mapping.helper';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromCommunityPostReducer from '../reducers';

import { CommunitySearchResult } from '../../../../../libs/models/community';
import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';

import * as fromCommunityPostFilterReplyViewActions from '../actions/community-post-filter-reply-view.actions';
import * as fromCommunityPostAddReplyViewActions from '../actions/community-post-add-reply-view.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../actions/community-post-reply.actions';
import { CommunityPostSearchRequest } from '../models/community-post-search-request.model';

@Injectable()
export class CommunityPostEffectsService {

  private static buildSearchRequestObject(filtersPagingAndPostContext: any): CommunityPostSearchRequest {
    const pagingOptionsRequestObj = mapResultsPagingOptionsToPagingOptions(filtersPagingAndPostContext.pagingOptions);
    const communityPostSearchRequest: CommunityPostSearchRequest = {
      PagingOptions: pagingOptionsRequestObj
    };
    return communityPostSearchRequest;
  }

  searchCommunityPosts(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(

      withLatestFrom(
        this.store.select(fromCommunityPostReducer.getCommunityPostFilterOptions),
        this.store.select(fromCommunityPostReducer.getDiscussionPagingOptions),
        (action: fromCommunityPostActions.GettingCommunityPosts, filters, pagingOptions) =>
          ({ action, filters, pagingOptions })
      ),

      switchMap(search => {
        const searchRequest = CommunityPostEffectsService.buildSearchRequestObject(search);

        return this.communityPostService.getPosts({
          PagingOptions: search.pagingOptions,
          FilterOptions: search.filters
        }).pipe(
          concatMap((communitySearchResult: CommunitySearchResult) => {
            const replyIds = communitySearchResult.FilteredReplies.map(reply => reply.Id);

            const actions = [];
            actions.push(new fromCommunityPostFilterReplyViewActions.ClearingCommunityPostFilteredRepliesToView
            (communitySearchResult.FilteredReplies));
            actions.push(new fromCommunityPostAddReplyViewActions.ClearingAllCommunityPostReplies());

            if (searchRequest.PagingOptions.StartIndex > 1) {
              actions.push(new fromCommunityPostActions.GettingMoreCommunityPostsSuccess(communitySearchResult));
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

constructor(private store: Store<fromCommunityPostReducer.State>, private communityPostService: CommunityPostApiService) {}
}
