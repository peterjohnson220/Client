import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromAddDataReducer from '../../reducers';
import { Filter, FilterType } from '../../models';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  filters$: Observable<Filter[]>;
  numberOfResults$: Observable<number>;
  pageShown$: Observable<boolean>;

  pageShowSub: Subscription;

  filterTypes = FilterType;
  focusedFilter: string;

  constructor(
    private store: Store<fromAddDataReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.numberOfResults$ = this.store.select(fromAddDataReducer.getResultsTotal);
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

  handleMultiSelectOptionSelected(idObj: { filterId: string, optionId: string }) {
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(idObj));
  }

  handleResetSection(filterId: string) {
    this.focusedFilter = '';
    this.changeDetector.detectChanges();
    this.focusedFilter = filterId;

    this.store.dispatch(new fromSearchFiltersActions.ResetFilter(filterId));
  }

  handleResetAllClicked() {
    this.store.dispatch(new fromSearchFiltersActions.ResetAllFilters());
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

