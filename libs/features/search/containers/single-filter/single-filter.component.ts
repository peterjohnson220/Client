import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromSearchReducer from '../../reducers';
import { Filter, MultiSelectOption, FilterType } from '../../models';

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
  filterTypes = FilterType;
  subFilters$: Observable<Filter[]>;
  childFilter$: Observable<Filter>;
  childFilterParentOptionValue$: Observable<any>;

  constructor(
    protected store: Store<fromSearchReducer.State>,
  ) {
    this.singledFilter$ = this.store.select(fromSearchReducer.getSingledFilter);
    this.selectionCount$ = this.store.select(fromSearchReducer.getSingledFilterSelectionCount);
    this.loadingOptions$ = this.store.select(fromSearchReducer.getLoadingOptions);
    this.loadingOptionsError$ = this.store.select(fromSearchReducer.getLoadingOptionsError);
    this.searchValue$ = this.store.select(fromSearchReducer.getSingledFilterSearchValue);
    this.subFilters$ = this.store.select(fromSearchReducer.getSubFilters);
    this.childFilter$ = this.store.select(fromSearchReducer.getChildFilter);
    this.childFilterParentOptionValue$ = this.store.select(fromSearchReducer.getChildFilterParentOptionValue);
    }

  ngOnInit() {
    this.store.dispatch(new fromSingledFilterActions.SearchAggregation());
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
    this.store.dispatch(new fromSingledFilterActions.SearchAggregation());
  }
}
