import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, withLatestFrom} from 'rxjs/operators';

import { CommunitySearchApiService } from 'libs/data/payfactors-api/community/community-search-api.service';

import * as fromCommunitySearchReducer from '../reducers/index';
import * as fromCommunitySearchActions from '../actions/community-search.actions';

@Injectable()
export class CommunitySearchEffects {

  @Effect()
  searchingCommunity$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromCommunitySearchActions.SEARCHING_COMMUNITY),
      switchMap((action: fromCommunitySearchActions.SearchingCommunity) =>
        this.communitySearchService.searchCommunity(action.payload).pipe(
          map((response: any) => {
            return new fromCommunitySearchActions.SearchingCommunitySuccess(response);
          }),
          catchError(error => of(new fromCommunitySearchActions.SearchingCommunityError()))
        )
      )
    );

  @Effect()
  gettingMoreCommunitySearchResults$: Observable<Action> = this.actions$.pipe(
    ofType(fromCommunitySearchActions.GETTING_MORE_COMMUNITY_SEARCH_RESULTS),
    map((action: fromCommunitySearchActions.GettingMoreCommunitySearchResults) => action.payload),
    withLatestFrom(this.store.pipe(select(fromCommunitySearchReducer.getSearchResultsPagingOptions)),
      (actionPayload, storePayload) => {
        return { actionPayload, storePayload };
      }
    ),
    switchMap(payload => {
      return this.communitySearchService.searchCommunity(
          payload.actionPayload,
          payload.storePayload.From,
          payload.storePayload.Count).pipe(
        map((response: any) => {
          return new fromCommunitySearchActions.GettingMoreCommunitySearchResultsSuccess(response);
        }),
        catchError( error => of(new fromCommunitySearchActions.GettingMoreCommunitySearchResultsError()))
      );
    })
  );

 constructor(
    private actions$: Actions,
    private communitySearchService: CommunitySearchApiService, private store: Store<fromCommunitySearchReducer.State>
  ) {}
}
