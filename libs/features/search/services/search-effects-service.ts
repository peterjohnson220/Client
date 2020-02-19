import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromUserFilterActions from 'libs/features/user-filter/actions/user-filter.actions';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSearchReducer from '../reducers';

@Injectable()
export class SearchEffectsService {

  handleFilterRemoval(action$: Actions<Action>): Observable<Action> {
    return action$.pipe(
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchingFilter),
        this.store.select(fromSearchReducer.getSingledFilter),
        (action: any, searchingFilter, singledFilter) => ({ action, searchingFilter, singledFilter })
      ),
      mergeMap(data => {
        const actions = [];

        if (data.searchingFilter && data.singledFilter.Id !== data.action.payload.filterId) {
          // TODO: Should this be load more?
          const scrollPayload = {
            scrollId: ScrollIdConstants.SEARCH_SINGLED_FILTER
          };
          actions.push(new fromInfiniteScrollActions.Load(scrollPayload));
        }

        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }));
        actions.push(new fromUserFilterActions.SetSelected({ selected: false }));

        return actions;
      })
    );
  }

  constructor(
    private store: Store<fromSearchReducer.State>
  ) {
  }
}
