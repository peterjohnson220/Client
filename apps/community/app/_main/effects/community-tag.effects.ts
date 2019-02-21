import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, debounceTime} from 'rxjs/operators';

import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

import * as fromCommunityTagActions from '../actions/community-tag.actions';

import { CommunityTag } from 'libs/models';

@Injectable()
export class CommunityTagEffects {

  @Effect()
  gettingCommunityTrendingTags$: Observable<Action> = this.actions$
    .ofType(fromCommunityTagActions.LOADING_COMMUNITY_TRENDING_TAGS).pipe(
      switchMap((action: fromCommunityTagActions.LoadingCommunityTrendingTags) =>
        this.communityTagService.getPopularTags().pipe(
          map((response: any) => {
            return new fromCommunityTagActions.LoadingCommunityTrendingTagsSuccess(response);
          }),
          catchError(error => of(new fromCommunityTagActions.LoadingCommunityTrendingTagsError()))
        )
      )
    );

  @Effect()
  suggestingCommunityPosts$: Observable<Action> = this.actions$
    .ofType(fromCommunityTagActions.SUGGESTING_COMMUNITY_TAGS).pipe(
      debounceTime(200),
      switchMap((action: fromCommunityTagActions.SuggestingCommunityTags) =>
        this.communityTagService.suggestTags(action.payload.query).pipe(
          map((response: CommunityTag[]) => {
            return new fromCommunityTagActions.SuggestingCommunityTagsSuccess(response);
          }),
          catchError(error => of(new fromCommunityTagActions.SuggestingCommunityTagsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityTagService: CommunityTagApiService,
  ) {}
}
