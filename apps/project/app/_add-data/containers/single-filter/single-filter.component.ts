import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchActions from '../../actions/search.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import { Filter, MultiSelectOption } from '../../models';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-single-filter',
  templateUrl: './single-filter.component.html',
  styleUrls: ['./single-filter.component.scss']
})
export class SingleFilterComponent implements OnInit {
  singledFilter$: Observable<Filter>;
  selectionCount$: Observable<number>;
  loadingOptions$: Observable<boolean>;
  loadingOptionsError$: Observable<boolean>;
  searchValue$: Observable<string>;

  constructor(
    private store: Store<fromAddDataReducer.State>,
  ) {
    this.singledFilter$ = this.store.select(fromAddDataReducer.getSingledFilter);
    this.selectionCount$ = this.store.select(fromAddDataReducer.getSingledFilterSelectionCount);
    this.loadingOptions$ = this.store.select(fromAddDataReducer.getLoadingOptions);
    this.loadingOptionsError$ = this.store.select(fromAddDataReducer.getLoadingOptionsError);
    this.searchValue$ = this.store.select(fromAddDataReducer.getSingledFilterSearchValue);
  }

  ngOnInit() {
    this.store.dispatch(new fromSingledFilterActions.SearchAggregation());
  }

  backToAllFilters() {
    this.store.dispatch(new fromSearchActions.ToggleFilterSearch());
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
    this.store.dispatch(new fromSingledFilterActions.SearchAggregation());
  }
}
