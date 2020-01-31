import { Component, OnInit } from '@angular/core';
import {SingleFilterComponent} from '../single-filter';
import {Store} from '@ngrx/store';
import * as fromSearchReducer from '../../reducers';
import {Observable} from 'rxjs';
import {Filter, MultiSelectOption} from '../../models';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromSingledFilterActions from '../../actions/singled-filter.actions';
import * as fromChildFilterActions from '../../actions/child-filter.actions';

@Component({
  selector: 'pf-sub-filter',
  templateUrl: './sub-filter.component.html',
  styleUrls: ['./sub-filter.component.scss']
})
export class SubFilterComponent extends SingleFilterComponent implements OnInit {
  filter$: Observable<Filter>;
  searchValue$: Observable<string>;
  selectionCount$: Observable<number>;

  constructor(store: Store<fromSearchReducer.State>) {
    super(store);
    this.filter$ = this.store.select(fromSearchReducer.getChildFilter);
    this.searchValue$ = this.store.select(fromSearchReducer.getChildFilterSearchValue);
    this.selectionCount$ = this.store.select(fromSearchReducer.getChildFilterSelectionCount);

  }
  ngOnInit() {
  }

  handleMultiSelectOptionSelected(optionSelectedObj: { filterId: string, option: MultiSelectOption }) {
    this.store.dispatch(new fromChildFilterActions.ToggleMultiSelectOption(optionSelectedObj));
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj));
  }
  handleClearSection(filterId: string) {
    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: filterId}));
    this.store.dispatch(new fromChildFilterActions.ClearSelections());
  }

  handleSearchValueChanged(value: string) {
    this.store.dispatch(new fromChildFilterActions.SetSearchValue(value));
    this.store.dispatch(new fromChildFilterActions.SearchAggregation());
  }

}
