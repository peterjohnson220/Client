import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSearchFiltersActions from '../../actions/search-filters.actions';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {
  staticFilters$: Observable<any>;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.staticFilters$ = this.store.select(fromAddDataReducer.getStaticFilters);
  }

  handleValueChanged(field: string, value: string) {
    this.store.dispatch(new fromSearchFiltersActions.UpdateStaticFilterValue({Field: field, Value: value}));
  }
}

