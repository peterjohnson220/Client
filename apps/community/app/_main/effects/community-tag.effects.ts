import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, debounceTime} from 'rxjs/operators';

import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

import * as fromCommunityTagActions from '../actions/community-tag.actions';

import { CommunityTag } from 'libs/models';

@Injectable()
export class CommunityTagEffects {

  @Effect()
  suggestingCommunityPosts$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityTagActions.SUGGESTING_COMMUNITY_TAGS),
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
