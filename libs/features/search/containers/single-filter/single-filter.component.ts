import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';
import * as fromInfiniteScrollReducer from 'libs/features/infinite-scroll/reducers';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromSearchReducer from '../../reducers';
import { MultiSelectOption, FilterType, MultiSelectFilter } from '../../models';

@Component({
  selector: 'pf-single-filter',
  templateUrl: './single-filter.component.html',
  styleUrls: ['./single-filter.component.scss']
})
export class SingleFilterComponent implements OnInit, OnDestroy {
  filter$: Observable<MultiSelectFilter>;
  selectionCount$: Observable<number>;
  loadingOptions$: Observable<boolean>;
  loadingOptionsError$: Observable<boolean>;
  searchValue$: Observable<string>;
  filterTypes = FilterType;

  filterSub: Subscription;

  filter: MultiSelectFilter;
  scrollId: string;
  get numberOfCurrentResults(): number {
    if (!this.filter) {
      return 0;
    }

    return (<MultiSelectFilter>this.filter).Options.length;
  }
  constructor(protected store: Store<fromSearchReducer.State>) {
    this.scrollId = ScrollIdConstants.SEARCH_SINGLED_FILTER;
    this.filter$ = <any>this.store.select(fromSearchReducer.getSingledFilter);
    this.selectionCount$ = this.store.select(fromSearchReducer.getSingledFilterSelectionCount);
    this.searchValue$ = this.store.select(fromSearchReducer.getSingledFilterSearchValue);
    this.loadingOptions$ = this.store.select(fromInfiniteScrollReducer.getLoading, this.scrollId);
    this.loadingOptionsError$ = this.store.select(fromInfiniteScrollReducer.getError, this.scrollId);
    }

  ngOnInit() {
    this.filterSub = this.filter$.subscribe((filter) => {
      this.filter = filter;
    });
    this.load();
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe();
  }

  backToAllFilters() {
    this.store.dispatch(new fromSearchPageActions.ToggleFilterSearch());
  }

  handleMultiSelectOptionSelected(optionSelectedObj: { filterId: string, option: MultiSelectOption }) {
    this.store.dispatch(new fromSingledFilterActions.ToggleMultiSelectOption(optionSelectedObj));
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj));
  }

  handleClearSection(filterId: string) {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: filterId}));
    this.store.dispatch(new fromSingledFilterActions.ClearSelections());
  }

  handleSearchValueChanged(value: string) {
    this.store.dispatch(new fromSingledFilterActions.SetSearchValue(value));
    this.load();
  }

  load(): void {
    this.store.dispatch(new fromInfiniteScrollActions.Load({scrollId: this.scrollId}));
  }
}
