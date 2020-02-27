import {Component, OnInit} from '@angular/core';
import {SingleFilterComponent} from '../single-filter';
import {Store} from '@ngrx/store';
import * as fromSearchReducer from '../../reducers';
import {Observable} from 'rxjs';
import {Filter, MultiSelectOption} from '../../models';
import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromChildFilterActions from '../../actions/child-filter.actions';
import {take} from 'rxjs/operators';

@Component({
  selector: 'pf-child-filter',
  templateUrl: './child-filter.component.html',
  styleUrls: ['./child-filter.component.scss']
})
export class ChildFilterComponent extends SingleFilterComponent implements OnInit {
  filter$: Observable<Filter>;
  searchValue$: Observable<string>;
  selectionCount$: Observable<number>;
  childLoadingOptions$: Observable<boolean>;
  childLoadingOptionsError$: Observable<boolean>;
  childFilterParentOptionValue$: Observable<string>;
  childFilterName$: Observable<string>;

  constructor(store: Store<fromSearchReducer.State>) {
    super(store);
    this.filter$ = this.store.select(fromSearchReducer.getChildFilter);
    this.searchValue$ = this.store.select(fromSearchReducer.getChildFilterSearchValue);
    this.selectionCount$ = this.store.select(fromSearchReducer.getChildFilterSelectionCount);
    this.childLoadingOptions$ = this.store.select(fromSearchReducer.getChildLoadingOptions);
    this.childLoadingOptionsError$ = this.store.select(fromSearchReducer.getChildLoadingOptionsError);
    this.childFilterParentOptionValue$ = this.store.select(fromSearchReducer.getChildFilterParentOptionValue);
    this.childFilterName$ = this.store.select(fromSearchReducer.getChildFilterName);
  }
  ngOnInit() {
    this.store.dispatch(new fromChildFilterActions.SearchAggregation());

  }

  handleMultiSelectOptionSelected(optionSelectedObj: { filterId: string, option: MultiSelectOption}) {
    this.store.dispatch(new fromChildFilterActions.ToggleMultiSelectOption(optionSelectedObj));
    this.store.dispatch(new fromSearchFiltersActions.ToggleMultiSelectOption(optionSelectedObj));
  }

  handleClearSection(filterId: string) {
    let parentOptionValue = '';
    this.childFilterParentOptionValue$.pipe(take(1)).subscribe( x => {
        parentOptionValue = x;
      }
    );

    this.store.dispatch(new fromSearchFiltersActions.ClearFilter({filterId: filterId, parentOptionValue: parentOptionValue}));
    this.store.dispatch(new fromChildFilterActions.ClearSelections());
  }

  handleSearchValueChanged(value: string) {
    this.store.dispatch(new fromChildFilterActions.SetSearchValue(value));
    this.store.dispatch(new fromChildFilterActions.SearchAggregation());
  }

}
