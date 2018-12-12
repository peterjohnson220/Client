import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSavedFiltersActions from '../actions/saved-filters.actions';
import * as fromSingledFilterActions from '../actions/singled-filter.actions';
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
          actions.push(new fromSingledFilterActions.SearchAggregation());
        }

        actions.push(new fromSearchResultsActions.GetResults({ keepFilteredOutOptions: true }));
        actions.push(new fromSavedFiltersActions.UnselectSavedFilter());

        return actions;
      })
    );
  }

  constructor(
    private store: Store<fromSearchReducer.State>
  ) {
  }
}
