import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { FilterAggregateGroup, PayMarket } from 'libs/models';
import { stateAbbrevToFullName } from 'libs/core/functions';

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

  filterAggregateGroups$: Observable<FilterAggregateGroup[]>;
  filterAggregateGroupsLoading$: Observable<boolean>;
  filterAggregateGroupsLoadingError$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  payMarket$: Observable<any>;

  constructor(private store: Store<fromPeerReducer.State>) {
    this.filterAggregateGroups$ = this.store.select(fromPeerReducer.getFilterAggregateGroups);
    this.filterAggregateGroupsLoading$ = this.store.select(fromPeerReducer.getFilterAggregateGroupsLoading);
    this.filterAggregateGroupsLoadingError$ = this.store.select(fromPeerReducer.getFilterAggregateGroupsLoadingError);
    this.limitToPayMarket$ = this.store.select(fromPeerReducer.getPeerFilterLimitToPayMarket);
    this.payMarket$ = this.store.select(fromPeerReducer.getPeerFilterPayMarket);
  }

  buildPayMarketBoundsFilterLabel(payMarket: PayMarket): string {
    if (!payMarket) { return ''; }

    let boundsLabel = '';

    switch (payMarket.GeoLabel) {
      case 'Metro':
        boundsLabel = `${payMarket.GeoValue} Metro`;
        break;
      case 'State':
        boundsLabel = stateAbbrevToFullName(payMarket.GeoValue);
        break;
      default:
        boundsLabel = payMarket.GeoValue;
        break;
    }

    return boundsLabel;
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
