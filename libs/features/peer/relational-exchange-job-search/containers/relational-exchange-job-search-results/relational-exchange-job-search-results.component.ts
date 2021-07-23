import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RelationalExchangeJobResult } from 'libs/models';

import * as fromRelationalExchangeJobSearchReducers from '../../reducers';
import * as fromRelationalExchangeJobSearchActions from '../../actions/relational-exchange-job-search.actions';

@Component({
  selector: 'pf-relational-exchange-job-search-results',
  templateUrl: './relational-exchange-job-search-results.component.html',
  styleUrls: ['./relational-exchange-job-search-results.component.scss']
})
export class RelationalExchangeJobSearchResultsComponent {

  // Observables
  exchangeJobResults$: Observable<RelationalExchangeJobResult[]>;
  loadingResults$: Observable<boolean>;
  noResultsMessage$: Observable<string>;

  constructor(private store: Store<fromRelationalExchangeJobSearchReducers.State>) {
    this.exchangeJobResults$ = this.store.select(fromRelationalExchangeJobSearchReducers.getExchangeJobs);
    this.noResultsMessage$ = this.store.select(fromRelationalExchangeJobSearchReducers.getNoResultsMessage);
  }

  trackByExchangeJobId(index, item: RelationalExchangeJobResult) {
    return item.ExchangeJobId;
  }

  handleExchangeJobSelectionToggle(exchangeJob: RelationalExchangeJobResult): void {
    this.store.dispatch(new fromRelationalExchangeJobSearchActions.ToggleExchangeJobSelection({exchangeJob}));
  }

}
