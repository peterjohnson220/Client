import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FilterAggregateGroup, PayMarket, ExchangeMapSummary, ToggleAggregateGroupSelections } from 'libs/models';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromPeerMapReducer from '../../reducers';
import { AggregateSelectionInfo } from '../../models';

@Component({
  selector: 'pf-peer-data-cut-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  // When provided a companyPayMarketId the sidebar will include a pay market bounds filter
  @Input() companyPayMarketId: number;

  filterAggregateGroups$: Observable<FilterAggregateGroup[]>;
  filterAggregateGroupsLoading$: Observable<boolean>;
  filterAggregateGroupsLoadingError$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  payMarket$: Observable<PayMarket>;
  previewLimit$: Observable<number>;
  mapSummary$: Observable<ExchangeMapSummary>;
  selectionsCount$: Observable<number>;

  constructor(private store: Store<fromPeerMapReducer.State>) {
    this.filterAggregateGroups$ = this.store.select(fromPeerMapReducer.getFilterAggregateGroups);
    this.filterAggregateGroupsLoading$ = this.store.select(fromPeerMapReducer.getFilterAggregateGroupsLoading);
    this.filterAggregateGroupsLoadingError$ = this.store.select(fromPeerMapReducer.getFilterAggregateGroupsLoadingError);
    this.limitToPayMarket$ = this.store.select(fromPeerMapReducer.getPeerFilterLimitToPayMarket);
    this.payMarket$ = this.store.select(fromPeerMapReducer.getPeerFilterPayMarket);
    this.previewLimit$ = this.store.select(fromPeerMapReducer.getPeerFilterPreviewLimit);
    this.mapSummary$ = this.store.select(fromPeerMapReducer.getPeerMapSummary);
    this.selectionsCount$ = this.store.select(fromPeerMapReducer.getPeerFilterSelectionsCount);
  }

  trackByFilterProp(index: number, filterAggregateGroup: FilterAggregateGroup): string {
    return filterAggregateGroup.MetaData.FilterProp;
  }

  // Events
  handleAggregateToggled(aggregateSelectionInfo: AggregateSelectionInfo) {
    this.store.dispatch(new fromFilterSidebarActions.ToggleAggregateSelected(aggregateSelectionInfo));
  }

  handleLimitToPayMarketToggled() {
    this.store.dispatch(new fromFilterSidebarActions.ToggleLimitToPayMarket());
  }

  handleAggregateGroupSelectionsToggled(toggleAggregateGroupSelectionsPayload: ToggleAggregateGroupSelections) {
    this.store.dispatch(new fromFilterSidebarActions.ToggleGroupSelections(toggleAggregateGroupSelectionsPayload));
  }

  handleClearAllSelections() {
    this.store.dispatch(new fromFilterSidebarActions.ClearAllSelections());
  }

  ngOnInit() {
    if (this.companyPayMarketId) {
      this.store.dispatch(new fromFilterSidebarActions.LoadPayMarketInformation(this.companyPayMarketId));
    }
  }
}
