import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunityPostApiService } from 'libs/data/payfactors-api/community/community-post-api.service';

import * as fromCommunityLikeActions from '../actions/community-like.actions';

import { CommunityUserInfo } from 'libs/models';

@Injectable()
export class CommunityLikeEffects {

  @Effect()
  gettingCommunityLikes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityLikeActions.LOADING_COMMUNITY_LIKES),
      switchMap((action: fromCommunityLikeActions.LoadingCommunityLikes) =>
        this.communityPostService.getCommunityLikes(action.payload).pipe(
          map((communityLikes: CommunityUserInfo[]) => {
            return new fromCommunityLikeActions.LoadingCommunityLikesSuccess(communityLikes);
          }),
          catchError(error => of(new fromCommunityLikeActions.LoadingCommunityLikesError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityPostService: CommunityPostApiService) {
  }
}
