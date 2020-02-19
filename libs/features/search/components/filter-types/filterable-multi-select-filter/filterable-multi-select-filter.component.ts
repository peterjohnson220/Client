import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { faFilter as solidFilter} from '@fortawesome/pro-solid-svg-icons';
import { faFilter as borderFilter} from '@fortawesome/pro-light-svg-icons';

import { Filter, FilterableMultiSelectFilter, FilterableMultiSelectOption } from 'libs/features/search/models';
import { ScrollIdConstants } from 'libs/features/infinite-scroll/models';
import * as fromSearchReducer from 'libs/features/search/reducers';
import * as fromInfiniteScrollReducer from 'libs/features/infinite-scroll/reducers';
import * as fromChildFilterActions from 'libs/features/search/actions/child-filter.actions';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromInfiniteScrollActions from 'libs/features/infinite-scroll/actions/infinite-scroll.actions';

import { MultiSelectFilterComponent } from '../multi-select-filter';

@Component({
  selector: 'pf-filterable-multi-select-filter',
  templateUrl: './filterable-multi-select-filter.component.html',
  styleUrls: ['./filterable-multi-select-filter.component.scss']
})
export class FilterableMultiSelectFilterComponent extends MultiSelectFilterComponent {
  @Input() filter: FilterableMultiSelectFilter;
  @Output() optionSelected: EventEmitter<{filterId: string, option: FilterableMultiSelectOption}> = new EventEmitter();
  childFilter$: Observable<Filter>;
  childFilterParentOptionValue$: Observable<any>;
  subFilters$: Observable<Filter[]>;
  solidFilter = solidFilter;
  borderFilter = borderFilter;
  searchingChildFilter$: Observable<boolean>;
  loadingChildOptions$: Observable<boolean>;

  constructor(private store: Store<fromSearchReducer.State>) {
    super();
    this.childFilter$ = this.store.select(fromSearchReducer.getChildFilter);
    this.childFilterParentOptionValue$ = this.store.select(fromSearchReducer.getChildFilterParentOptionValue);
    this.subFilters$ = this.store.select(fromSearchReducer.getChildFilters);
    this.searchingChildFilter$ = this.store.select(fromSearchReducer.getSearchingChildFilter);
    this.loadingChildOptions$  = this.store.select(fromInfiniteScrollReducer.getLoading, ScrollIdConstants.SEARCH_CHILD_FILTER);
  }

  optionDisabled(option: FilterableMultiSelectOption) {
    return (!option.Selected && option.Count === 0) || this.filter.Locked;
  }

  handleFilterableOptionSelected(filter: Filter, option: FilterableMultiSelectOption) {
    let subFilters = null;
    let existingChildFilter = null;
    let childFilterParentOptionValue = null;
    let searchingChildFilter = null;
    let loadingChildOptions = null;

    this.subFilters$.pipe(take(1)).subscribe(x => {
      subFilters = x;
    });
    this.childFilter$.pipe(take(1)).subscribe(cf => {
      existingChildFilter = cf;
    });
    this.childFilterParentOptionValue$.pipe(take(1)).subscribe(cfp => {
      childFilterParentOptionValue = cfp;
    });
    this.searchingChildFilter$.pipe(take(1)).subscribe(scf => {
      searchingChildFilter = scf;
    });
    this.loadingChildOptions$.pipe(take(1)).subscribe(lco => {
      loadingChildOptions = lco;
    });

    const selectedChildFilter = subFilters.find(x => x.ParentBackingField === filter.BackingField);

    const childFilterExists = !(existingChildFilter === null || searchingChildFilter === false);

    const currentChildFilterClicked = this.childFiltersAreEquivalent(selectedChildFilter, existingChildFilter) &&
      this.optionValuesAreEquivalent(option.Value, childFilterParentOptionValue);

    if (!childFilterExists) {
      this.store.dispatch(new fromChildFilterActions.SetChildFilter({filter: selectedChildFilter, parentOption: option}));
      this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
      this.store.dispatch(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_CHILD_FILTER}));
      return;
    }
    if (currentChildFilterClicked && !loadingChildOptions) {
      this.store.dispatch(new fromSearchPageActions.ToggleChildFilterSearch());
      this.store.dispatch(new fromChildFilterActions.ClearChildFilter());
      return;
    }
    this.store.dispatch(new fromChildFilterActions.SetChildFilter({filter: selectedChildFilter, parentOption: option}));
    this.store.dispatch(new fromInfiniteScrollActions.Load({scrollId: ScrollIdConstants.SEARCH_CHILD_FILTER}));
  }

  childFiltersAreEquivalent(filterA: Filter, filterB: Filter): boolean {
      return (filterA && filterB) && filterA.ParentBackingField === filterB.ParentBackingField;
  }

  optionValuesAreEquivalent(optionValueA: any, optionValueB: any) {
    return (optionValueA && optionValueB) && optionValueA === optionValueB;
  }
}
