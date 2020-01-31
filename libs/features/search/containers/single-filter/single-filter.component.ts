import {Component, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import * as fromSearchPageActions from '../../actions/search-page.actions';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import { Filter, MultiSelectOption, FilterType } from '../../models';
import * as fromSearchReducer from '../../reducers';
import * as fromChildFilterActions from '../../actions/child-filter.actions';

@Component({
  selector: 'pf-single-filter',
  templateUrl: './single-filter.component.html',
  styleUrls: ['./single-filter.component.scss']
})
export class SingleFilterComponent implements OnInit, OnDestroy {
  singledFilter$: Observable<Filter>;
  selectionCount$: Observable<number>;
  loadingOptions$: Observable<boolean>;
  loadingOptionsError$: Observable<boolean>;
  searchValue$: Observable<string>;
  filterTypes = FilterType;
  subFilters: Filter[];
  subFilters$: Observable<Filter[]>;
  subFilterSub: Subscription;

  constructor(
    protected store: Store<fromSearchReducer.State>,
  ) {
    this.singledFilter$ = this.store.select(fromSearchReducer.getSingledFilter);
    this.selectionCount$ = this.store.select(fromSearchReducer.getSingledFilterSelectionCount);
    this.loadingOptions$ = this.store.select(fromSearchReducer.getLoadingOptions);
    this.loadingOptionsError$ = this.store.select(fromSearchReducer.getLoadingOptionsError);
    this.searchValue$ = this.store.select(fromSearchReducer.getSingledFilterSearchValue);
    this.subFilters$ = this.store.select(fromSearchReducer.getSubFilters);
    }

  ngOnInit() {
    this.store.dispatch(new fromSingledFilterActions.SearchAggregation());
    this.subFilterSub = this.subFilters$.subscribe(s => this.subFilters = s);
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

  handleFilterableMultiSubFilterSelected(subFilterSelectedObj: {filter: Filter, optionValue: any}) {
    // TODO: this will eventually update the SubAgg Options based off of the optionId
    // this.store.dispatch(new fromSearchFiltersActions.UpdateSubFilters(subFilterSelectedObj.filter, subFilterSelectedObj.optionId));
    const childFilter = this.subFilters.find(x => x.ParentBackingField === subFilterSelectedObj.filter.BackingField);



    this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
    this.store.dispatch(new fromChildFilterActions.SetChildFilter({filter: childFilter, parentOptionValue: subFilterSelectedObj.optionValue}));
  }

  ngOnDestroy(): void {
    this.subFilterSub.unsubscribe();
  }
}
