import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchActions from '../../actions/search.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import { Filter, MultiSelectOption } from '../../models';
import * as fromSharedSearchReducer from '../../reducers';

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
    private store: Store<fromSharedSearchReducer.State>,
  ) {
    this.singledFilter$ = this.store.select(fromSharedSearchReducer.getSingledFilter);
    this.selectionCount$ = this.store.select(fromSharedSearchReducer.getSingledFilterSelectionCount);
    this.loadingOptions$ = this.store.select(fromSharedSearchReducer.getLoadingOptions);
    this.loadingOptionsError$ = this.store.select(fromSharedSearchReducer.getLoadingOptionsError);
    this.searchValue$ = this.store.select(fromSharedSearchReducer.getSingledFilterSearchValue);
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
