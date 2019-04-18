import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunitySearchReducer from '../../reducers';

import { CommunitySearchResult } from 'libs/models/community';

@Component({
  selector: 'pf-community-search-results',
  templateUrl: './community-search-results.component.html',
  styleUrls: [ './community-search-results.component.scss' ]
})
export class CommunitySearchResultsComponent {
  loadingSearchResults$: Observable<boolean>;
  loadingSearchResultsError$: Observable<boolean>;
  communitySearchResults$: Observable<CommunitySearchResult[]>;

  constructor(public store: Store<fromCommunitySearchReducer.State>) {

    this.loadingSearchResults$ = this.store.select(fromCommunitySearchReducer.getLoadingSearchResults);
    this.loadingSearchResultsError$ = this.store.select(fromCommunitySearchReducer.getLoadingSearchResultsError);
    this.communitySearchResults$ = this.store.select(fromCommunitySearchReducer.getCommunitySearchResults);
  }

  executeSearch(query) {
    this.store.dispatch(new fromCommunitySearchActions.SearchingCommunity(query));
  }

  openDetailsModal(result) {
    this.store.dispatch(new fromCommunitySearchActions.OpenSearchResultModal(result));
  }

  trackByFn(index, item) {
    return item.Id;
  }
}
