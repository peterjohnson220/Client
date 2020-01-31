import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromChildFilterActions from '../../actions/child-filter.actions';
import * as fromSearchReducer from '../../reducers';
import {Filter, FilterableMultiSelectOption, FilterType, MultiSelectOption} from '../../models';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;
  @Input() defaultDisplayValue = 'block';
  @Input() defaultFocusedFilterId: string;

  subFilters: Filter[];
  filters$: Observable<Filter[]>;
  subFilters$: Observable<Filter[]>;
  pageShown$: Observable<boolean>;
  filterSearchVisible$: Observable<boolean>;
  pageShowSub: Subscription;
  filterTypes = FilterType;
  focusedFilter: string;

  subFiltersSub: Subscription;
  childFilter$: Observable<Filter>;
  childFilterParentOptionValue$: Observable<any>;
  childFilterSub: Subscription;
  childFilterParentOptionValueSub: Subscription;
  childFilter: Filter;
  childFilterParentOptionValue: any;

  constructor(
    private store: Store<fromSearchReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.filters$ = this.store.select(fromSearchReducer.getFilters);
    this.subFilters$ = this.store.select(fromSearchReducer.getSubFilters);
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

  handleFilterableMultiSubFilterSelected(subFilterSelectedObj: {filter: Filter, optionValue: any}) {
    // TODO: this will eventually update the SubAgg Options based off of the optionId
    // this.store.dispatch(new fromSearchFiltersActions.UpdateSubFilters(subFilterSelectedObj.filter, subFilterSelectedObj.optionValue));
    const childFilter = this.subFilters.find(x => x.ParentBackingField === subFilterSelectedObj.filter.BackingField);

    if (!this.childFilter) {
      this.store.dispatch(new fromChildFilterActions.SetChildFilter({filter: childFilter, parentOptionValue: subFilterSelectedObj.optionValue}));
      this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
    } else if (
      childFilter.ParentBackingField === this.childFilter.ParentBackingField
      && subFilterSelectedObj.optionValue === this.childFilterParentOptionValue) {
      this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
      this.store.dispatch(new fromChildFilterActions.ClearChildFilter());
    } else {
      this.store.dispatch(new fromChildFilterActions.SetChildFilter({filter: childFilter, parentOptionValue: subFilterSelectedObj.optionValue}));
    }
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
    this.toggleFilterSearch(filter);
  }

  // Lifecycle
  ngOnInit() {
    this.pageShowSub = this.pageShown$.subscribe(ps => {
      if (ps) {
        this.focusedFilter = this.defaultFocusedFilterId;
      }
    });
    this.subFiltersSub = this.subFilters$.subscribe( f =>
      this.subFilters = f
    );
    this.childFilterSub = this.childFilter$.subscribe(f =>
    this.childFilter = f);
    this.childFilterParentOptionValueSub = this.childFilterParentOptionValue$.subscribe(x => this.childFilterParentOptionValue = x);
  }

  ngOnDestroy() {
    this.pageShowSub.unsubscribe();
    this.subFiltersSub.unsubscribe();
    this.childFilterSub.unsubscribe();
    this.childFilterParentOptionValueSub.unsubscribe();
  }

  private toggleFilterSearch(filter: Filter): void {
    this.store.dispatch(new fromSearchPageActions.ToggleFilterSearch());
    this.store.dispatch(new fromSingledFilterActions.SetSingledFilter(filter));
  }
}

