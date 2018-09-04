import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityTagApiService } from 'libs/data/payfactors-api/community/community-tag-api.service';

import * as fromCommunityTagActions from '../actions/community-tag.actions';

@Injectable()
export class CommunityTagEffects {

  @Effect()
  gettingCommunityPopularTags$: Observable<Action> = this.actions$
    .ofType(fromCommunityTagActions.LOADING_COMMUNITY_POPULAR_TAGS).pipe(
      switchMap((action: fromCommunityTagActions.LoadingCommunityPopularTags) =>
        this.communityTagService.getPopularTags().pipe(
          map((response: any) => {
            return new fromCommunityTagActions.LoadingCommunityPopularTagsSuccess(response);
          }),
          catchError(error => of(new fromCommunityTagActions.LoadingCommunityPopularTagsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityTagService: CommunityTagApiService,
  ) {}
}
