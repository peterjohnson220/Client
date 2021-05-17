import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromExchangeJobSearchReducers from '../../reducers';
import * as fromExchangeJobSearchActions from '../../actions/exchange-job-search.actions';

@Component({
  selector: 'pf-exchange-job-search-results',
  templateUrl: './exchange-job-search-results.component.html',
  styleUrls: ['./exchange-job-search-results.component.scss']
})
export class ExchangeJobSearchResultsComponent {

  // Observables
  exchangeJobResults$: Observable<any[]>; // TODO: [JP] TYPE
  loadingResults$: Observable<boolean>;
  noResultsMessage$: Observable<string>;

  constructor(private store: Store<fromExchangeJobSearchReducers.State>) {
    this.exchangeJobResults$ = this.store.select(fromExchangeJobSearchReducers.getExchangeJobs);
    this.noResultsMessage$ = this.store.select(fromExchangeJobSearchReducers.getNoResultsMessage);
  }

  trackByExchangeJobId(index, item: any) { // TODO: [JP] TYPE
    return item.ExchangeJobId;
  }

  handleExchangeJobSelectionToggle(exchangeJob: any): void { // TODO: [JP] TYPE
    this.store.dispatch(new fromExchangeJobSearchActions.ToggleExchangeJobSelection({exchangeJob}));
  }

}
