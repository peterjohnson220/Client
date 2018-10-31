import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromCommunityPostFilterOptionsActions from '../actions/community-post-filter-options.actions';
import * as fromCommunityPostActions from '../actions/community-post.actions';

@Injectable()
export class CommunityPostFilterOptionsEffects {
  @Effect()
  addingCateogryFilters$ = this.actions$
    .ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_CATEGORY_TO_FILTER_OPTIONS)
    .pipe(
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  removingCategoryFilters$ = this.actions$
    .ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_CATEGORY_FROM_FILTER_OPTIONS)
    .pipe(
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  addingTagFilters$ = this.actions$
    .ofType(fromCommunityPostFilterOptionsActions.ADDING_COMMUNITY_TAG_TO_FILTER_OPTIONS)
    .pipe(
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );

  @Effect()
  removingTagFilters$ = this.actions$
    .ofType(fromCommunityPostFilterOptionsActions.DELETING_COMMUNITY_TAG_FROM_FILTER_OPTIONS)
    .pipe(
      map(() => new fromCommunityPostActions.GettingCommunityPosts())
    );
  constructor(
    private actions$: Actions
  ) {
  }
}
