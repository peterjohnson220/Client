import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromAddSurveyDataPageActions from '../../actions/add-survey-data-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromAddDataReducer from '../../reducers';
import { Filter, FilterType, MultiSelectOption } from '../../models';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Input() visible: boolean;

  filters$: Observable<Filter[]>;
  pageShown$: Observable<boolean>;

  pageShowSub: Subscription;

  filterTypes = FilterType;
  focusedFilter: string;

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
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

  handleResetSection(filterId: string) {
    this.focusedFilter = '';
    this.changeDetector.detectChanges();
    this.focusedFilter = filterId;

    this.store.dispatch(new fromSearchFiltersActions.ResetFilter(filterId));
  }

  handleSearchSection(filter: Filter) {
    this.store.dispatch(new fromAddSurveyDataPageActions.ToggleFilterSearch());
    this.store.dispatch(new fromSingledFilterActions.SetSingledFilter(filter));
  }

  // Lifecycle
  ngOnInit() {
    this.pageShowSub = this.pageShown$.subscribe(ps => {
      if (ps) {
        this.focusedFilter = 'jobTitleCode';
      }
    });
  }

  ngOnDestroy() {
    this.pageShowSub.unsubscribe();
  }
}

