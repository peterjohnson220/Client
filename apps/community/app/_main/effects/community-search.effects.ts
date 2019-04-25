import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map} from 'rxjs/operators';

import { CommunitySearchApiService } from 'libs/data/payfactors-api/community/community-search-api.service';

import * as fromCommunitySearchActions from '../actions/community-search.actions';

@Injectable()
export class CommunitySearchEffects {

  @Effect()
  searchingCommunity$: Observable<Action> = this.actions$
    .ofType(fromCommunitySearchActions.SEARCHING_COMMUNITY).pipe(
      switchMap((action: fromCommunitySearchActions.SearchingCommunity) =>
        this.communitySearchService.searchCommunity(action.payload).pipe(
          map((response: any) => {
            return new fromCommunitySearchActions.SearchingCommunitySuccess(response);
          }),
          catchError(error => of(new fromCommunitySearchActions.SearchingCommunityError()))
        )
      )
    );

 constructor(
    private actions$: Actions,
    private communitySearchService: CommunitySearchApiService,
  ) {}
}
