import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { SearchFeatureIds } from '../enums/search-feature-ids';
import { SearchFeatureState } from '../reducers';
import * as fromSearchReducer from '../reducers';
import * as fromChildFilterActions from '../actions/child-filter.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromSearchPageActions from '../actions/search-page.actions';
import * as fromSearchResultsActions from '../actions/search-results.actions';
import * as fromSingledFilterActions from '../actions/singled-filter.actions';

@Injectable()
export class SearchFeaturePersistenceService {
  private searchFeaturePersistenceDictionary: {[key: string]: SearchFeatureState} = {};

  set(searchFeatureId: SearchFeatureIds): void {
    let currentState: SearchFeatureState = null;
    this.store.pipe(select(fromSearchReducer.selectFeatureAreaState), take(1)).subscribe(state => {
      currentState = state;
    });

    const currentSearchFeatureId = !!currentState && !!currentState.searchPage ? currentState.searchPage.searchFeatureId : null;
    if (!currentSearchFeatureId) {
      return;
    }
    if (!!this.searchFeaturePersistenceDictionary[searchFeatureId]) {
      const persistedState = this.searchFeaturePersistenceDictionary[searchFeatureId];
      this.store.dispatch(new fromChildFilterActions.Set(persistedState.childFilter));
      this.store.dispatch(new fromSearchFiltersActions.Set(persistedState.searchFilters));
      this.store.dispatch(new fromSearchPageActions.Set(persistedState.searchPage));
      this.store.dispatch(new fromSearchResultsActions.Set(persistedState.searchResults));
      this.store.dispatch(new fromSingledFilterActions.Set(persistedState.singledFilter));
    }

    if (currentSearchFeatureId !== searchFeatureId) {
      this.searchFeaturePersistenceDictionary[currentSearchFeatureId] = currentState;
    }
  }

  reset(searchFeatureId: SearchFeatureIds): void {
    if (!!this.searchFeaturePersistenceDictionary[searchFeatureId]) {
      this.searchFeaturePersistenceDictionary[searchFeatureId] = null;
    }

    let currentState: SearchFeatureState = null;
    this.store.pipe(select(fromSearchReducer.selectFeatureAreaState), take(1)).subscribe(state => {
      currentState = state;
    });

    if (!!currentState && !!currentState.searchPage && currentState.searchPage.searchFeatureId === searchFeatureId) {
      this.store.dispatch(new fromChildFilterActions.Reset());
      this.store.dispatch(new fromSearchFiltersActions.Reset());
      this.store.dispatch(new fromSearchPageActions.Reset());
      this.store.dispatch(new fromSearchResultsActions.Reset());
      this.store.dispatch(new fromSingledFilterActions.Reset());
    }
  }

  constructor(private store: Store<fromSearchReducer.State>) { }
}
