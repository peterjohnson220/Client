import { Component, OnInit, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FilterAggregateGroup, PayMarket, ExchangeMapSummary, ToggleAggregateGroupSelections } from 'libs/models';

import * as fromFilterSidebarActions from '../../actions/filter-sidebar.actions';
import * as fromPeerMapReducer from '../../reducers';
import * as fromFilterSidebarReducer from '../../reducers';
import { AggregateSelectionInfo } from '../../models';
import { ExchangeJobExchangeDetail } from '../../../models';

@Component({
  selector: 'pf-peer-data-cut-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  // When provided a companyPayMarketId the sidebar will include a pay market bounds filter
  @Input() companyPayMarketId: number;
  @Input() shouldShowPayMarketBoundsFilter = true;
  @Input() shouldShowExcludeIndirectJobMatchesFilter = true;
  @Input() shouldShowExchangeScopeSelector = true;
  @Input() companyJobId: number;

  filterAggregateGroups$: Observable<FilterAggregateGroup[]>;
  filterAggregateGroupsLoading$: Observable<boolean>;
  filterAggregateGroupsLoadingError$: Observable<boolean>;
  limitToPayMarket$: Observable<boolean>;
  excludeIndirectJobMatches$: Observable<boolean>;
  hasAdditionalJobLevels$: Observable<boolean>;
  payMarket$: Observable<PayMarket>;
  previewLimit$: Observable<number>;
  mapSummary$: Observable<ExchangeMapSummary>;
  selectionsCount$: Observable<number>;
  associatedJobs$: Observable<ExchangeJobExchangeDetail[]>;
  searchingAggregate$: Observable<boolean>;
  selectedExchangeJobId$: Observable<number>;

  constructor(private store: Store<fromPeerMapReducer.State>) {
    this.filterAggregateGroups$ = this.store.pipe(select(fromPeerMapReducer.getFilterAggregateGroups));
    this.filterAggregateGroupsLoading$ = this.store.pipe(select(fromPeerMapReducer.getFilterAggregateGroupsLoading));
    this.filterAggregateGroupsLoadingError$ = this.store.pipe(select(fromPeerMapReducer.getFilterAggregateGroupsLoadingError));
    this.limitToPayMarket$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterLimitToPayMarket));
    this.excludeIndirectJobMatches$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterExcludeIndirectJobMatches));
    this.hasAdditionalJobLevels$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterHasSimilarJobLevels));
    this.payMarket$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterPayMarket));
    this.previewLimit$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterPreviewLimit));
    this.mapSummary$ = this.store.pipe(select(fromPeerMapReducer.getPeerMapSummary));
    this.selectionsCount$ = this.store.pipe(select(fromPeerMapReducer.getPeerFilterSelectionsCount));
    this.associatedJobs$ = this.store.pipe(select(fromFilterSidebarReducer.getAssociatedExchangeJobs));
    this.searchingAggregate$ = this.store.pipe(select(fromFilterSidebarReducer.getSearchingAggregate));
    this.selectedExchangeJobId$ = this.store.pipe(select(fromFilterSidebarReducer.getSelectedExchangeJobId));
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

  handleIncludeAdditionalJobLevelsToggled() {
    this.store.dispatch(new fromFilterSidebarActions.ToggleExcludeIndirectJobMatches());
  }

  handleAggregateGroupSelectionsToggled(toggleAggregateGroupSelectionsPayload: ToggleAggregateGroupSelections) {
    this.store.dispatch(new fromFilterSidebarActions.ToggleGroupSelections(toggleAggregateGroupSelectionsPayload));
  }

  handleClearAllSelections() {
    this.store.dispatch(new fromFilterSidebarActions.ClearAllSelections);
    this.store.dispatch(new fromFilterSidebarActions.GetMapData);
  }

  handleSearchEvent(aggregateGroupId: string): void {
    this.store.dispatch(new fromFilterSidebarActions.ToggleAggregateSearch(aggregateGroupId));
  }

  onBackToAllFiltersClick(): void {
    this.store.dispatch(new fromFilterSidebarActions.ToggleAggregateSearch(null));
  }

  handleExchangeJobSelected(payload: {exchangeJobId: number, similarExchangeJobIds: number[]}): void {
    this.store.dispatch(new fromFilterSidebarActions.SetExchangeJobSelection(payload));
  }

  ngOnInit() {
    if (this.companyPayMarketId) {
      this.store.dispatch(new fromFilterSidebarActions.LoadPayMarketInformation(this.companyPayMarketId));
    }

    if (this.companyJobId) {
      this.store.dispatch(new fromFilterSidebarActions.LoadAssociatedExchangeJobs({companyJobId: this.companyJobId}));
    }
  }
}
