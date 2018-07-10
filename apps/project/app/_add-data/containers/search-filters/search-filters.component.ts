import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { JobContext } from '../../models';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent {
  jobContext$: Observable<JobContext>;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.jobContext$ = this.store.select(fromAddDataReducer.getJobContext);
  }
}

