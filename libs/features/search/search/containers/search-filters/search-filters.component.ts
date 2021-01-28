import {ChangeDetectorRef, Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Filter, FilterType, MultiSelectOption } from '../../models';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromSearchReducer from '../../reducers';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() defaultDisplayValue = 'block';
  @Input() defaultFocusedFilterId: string;
  @Input() serverShowMore = false;
  @Input() displayDescriptions = false;

  filters$: Observable<Filter[]>;
  subFilters$: Observable<Filter[]>;
  pageShown$: Observable<boolean>;
  filterSearchVisible$: Observable<boolean>;
  childFilter$: Observable<Filter>;
  childFilterParentOptionValue$: Observable<any>;
  pageShowSub: Subscription;
  filterTypes = FilterType;
  focusedFilter: string;

  constructor(
    private store: Store<fromSearchReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.filters$ = this.store.select(fromSearchReducer.getParentFilters);
    this.subFilters$ = this.store.select(fromSearchReducer.getChildFilters);
    this.pageShown$ = this.store.select(fromSearchReducer.getPageShown);
    this.filterSearchVisible$ = this.store.select(fromSearchReducer.getSearchingFilter);
    this.childFilter$ = this.store.select(fromSearchReducer.getChildFilter);
    this.childFilterParentOptionValue$ = this.store.select(fromSearchReducer.getChildFilterParentOptionValue);
  }

  shouldFocus(filter: Filter) {
    return filter.Id === this.focusedFilter;
  }

  trackByFilterId(index, item: Filter) {
    return item.Id;
  }

  // Events
  handleValueChanged(filterId: string, value: string) {
    this.store.dispatch(new fromSearchFiltersActions.UpdateFilterValue({ filterId, value }));
  }

  handleMultiSelectOptionSelected(optionSelectedObj: { filterId: string, option: MultiSelectOption }) {
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj));
  }

  handleRangeChange(rangeObj: {filterId: string, minValue: number, maxValue: number}) {
    this.store.dispatch(new fromSearchFiltersActions.UpdateRangeFilter(rangeObj));
  }

  handleClearSection(filterId: string) {
    this.focusedFilter = '';
    this.changeDetector.detectChanges();
    this.focusedFilter = filterId;

    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: filterId}));
  }

  handleSearchSection(filter: Filter) {
    this.toggleFilterSearch(filter);
  }

  handleSectionShowMore(filter: Filter) {
    if (this.serverShowMore) {
      this.filterShowMore(filter);
    } else {
      this.toggleFilterSearch(filter);
    }
  }

  handleSectionShowLess(filter: Filter) {
    this.filterShowLess(filter);
  }

  // Lifecycle
  ngOnInit() {
    this.pageShowSub = this.pageShown$.subscribe(ps => {
      if (ps) {
        this.focusedFilter = this.defaultFocusedFilterId;
      }
    });
  }

  ngOnDestroy() {
    this.pageShowSub.unsubscribe();
  }

  private toggleFilterSearch(filter: Filter): void {
    this.store.dispatch(new fromSearchPageActions.ToggleFilterSearch());
    this.store.dispatch(new fromSingledFilterActions.SetSingledFilter(filter));
  }

  private filterShowMore(filter: Filter): void {
    this.store.dispatch(new fromSearchFiltersActions.ShowMore({backingField: filter.BackingField}));
  }

  private filterShowLess(filter: Filter): void {
    this.store.dispatch(new fromSearchFiltersActions.ShowLess({backingField: filter.BackingField}));
  }
}

