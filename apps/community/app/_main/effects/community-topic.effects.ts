import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import * as fromCommunityTopicActions from '../actions/community-topic.actions';
import { CommunityFilterApiService } from 'libs/data/payfactors-api/community/community-filter-api.service';

@Injectable()
export class CommunityTopicEffects {

  @Effect()
  gettingCommunityTopics$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunityTopicActions.LOADING_COMMUNITY_TOPICS),
      switchMap((action: fromCommunityTopicActions.LoadingCommunityTopics) =>
        this.communityFilterService.getTopics().pipe(
          map((response: any) => {
            return new fromCommunityTopicActions.LoadingCommunityTopicsSuccess(response);
          }),
          catchError(error => of(new fromCommunityTopicActions.LoadingCommunityTopicsError()))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private communityFilterService: CommunityFilterApiService,
  ) {}
}
