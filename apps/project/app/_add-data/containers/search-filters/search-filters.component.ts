import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromAddDataReducer from '../../reducers';
import { Filter, FilterType } from '../../models';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {
  filters$: Observable<Filter[]>;
  numberOfResults$: Observable<number>;
  pageShown$: Observable<boolean>;
  filterTypes = FilterType;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.filters$ = this.store.select(fromAddDataReducer.getFilters);
    this.numberOfResults$ = this.store.select(fromAddDataReducer.getResultsTotal);
    this.pageShown$ = this.store.select(fromAddDataReducer.getPageShown);
  }

  handleValueChanged(id: string, value: string) {
    this.store.dispatch(new fromSearchFiltersActions.UpdateFilterValue({Id: id, Value: value}));
  }

  trackByFilterId(index, item: Filter) {
    return item.id;
  }
}

