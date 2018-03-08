import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters';

import * as fromPeerReducer from '../../reducers';
import * as fromPeerMapActions from '../../actions/map.actions';

@Component({
  selector: 'pf-peer-data-cut-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent {
  peerFilters$: Observable<FilterAggregateGroup[]>;
  peerFiltersLoading$: Observable<boolean>;
  peerFiltersLoadingError$: Observable<boolean>;

  constructor(private store: Store<fromPeerReducer.State>) {
    this.peerFilters$ = this.store.select(fromPeerReducer.getPeerFilters);
    this.peerFiltersLoading$ = this.store.select(fromPeerReducer.getPeerFiltersLoading);
    this.peerFiltersLoadingError$ = this.store.select(fromPeerReducer.getPeerFiltersLoadingError);
  }

  handleOptionToggled(e: any) {
    this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilter(e));
  }
}
