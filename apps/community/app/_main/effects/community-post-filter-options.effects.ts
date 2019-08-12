import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromCommunityPostFilterOptionsActions from '../actions/community-post-filter-options.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';
import * as fromCommunityFilterActions from '../actions/community-post-filter-options.actions';


@Injectable()
export class CommunityPostFilterOptionsEffects {
  @Effect()
  addingCateogryFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  removingCategoryFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  addingTagFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  removingTagFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  addingIndustryFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_INDUSTRY_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  removingIndustryFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_INDUSTRY_FROM_FILTER_OPTIONS),
      map(() =>
        new fromCommunityFilterActions.DeletingCommunityIndustryFromFilterOptionsSuccess())
    );
  @Effect()
  removingIndustryFiltersSuccess$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_INDUSTRY_FROM_FILTER_OPTIONS_SUCCESS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  addingCompanySizeFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_COMPANY_SIZE_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  removingCompanySizeFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_COMPANY_SIZE_FROM_FILTER_OPTIONS),
      map(() =>
        new fromCommunityFilterActions.DeletingCommunityCompanySizeFromFilterOptionsSuccess())
    );
  @Effect()
  removingCompanySizeFiltersSuccess$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_COMPANY_SIZE_FROM_FILTER_OPTIONS_SUCCESS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  changingTopicFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.CHANGING_COMMUNITY_TOPIC_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  removingTopicFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS),
      map(() =>
        new fromCommunityFilterActions.DeletingCommunityTopicFromFilterOptionsSuccess())
    );
  @Effect()
  removingTopicFiltersSuccess$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_TOPIC_FROM_FILTER_OPTIONS_SUCCESS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  addingPostFilter$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_POST_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  addingReplyFilter$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_POST_REPLY_TO_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  @Effect()
  deletingAllFilters$ = this.actions$
    .pipe(
      ofType(fromCommunityPostFilterOptionsActions.DELETING_ALL_FILTER_OPTIONS),
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  constructor(
    private actions$: Actions
  ) {
  }
}
