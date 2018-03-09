import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FilterAggregateGroup } from 'libs/models/peer/aggregate-filters';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromPeerReducer from '../../reducers';
import { AggregateSelectionInfo } from '../../models';

@Component({
  selector: 'pf-peer-data-cut-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  @Input() companyPayMarketId: number;

  peerFilters$: Observable<FilterAggregateGroup[]>;
  peerFiltersLoading$: Observable<boolean>;
  peerFiltersLoadingError$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  payMarket$: Observable<any>;

  constructor(private store: Store<fromPeerReducer.State>) {
    this.peerFilters$ = this.store.select(fromPeerReducer.getPeerFilters);
    this.peerFiltersLoading$ = this.store.select(fromPeerReducer.getPeerFiltersLoading);
    this.peerFiltersLoadingError$ = this.store.select(fromPeerReducer.getPeerFiltersLoadingError);
    this.limitToPayMarket$ = this.store.select(fromPeerReducer.getPeerFilterLimitToPayMarket);
    this.payMarket$ = this.store.select(fromPeerReducer.getPeerFilterPayMarket);
  }

  handleAggregateToggled(aggregateSelectionInfo: AggregateSelectionInfo) {
    this.store.dispatch(new fromFilterSidebarActions.ToggleAggregateSelected(aggregateSelectionInfo));
  }

  handleLimitToPayMarketToggled() {
    this.store.dispatch(new fromFilterSidebarActions.ToggleLimitToPayMarket());
  }

  ngOnInit() {
    this.store.dispatch(new fromFilterSidebarActions.LoadPayMarketInformation(this.companyPayMarketId));
  }
}
