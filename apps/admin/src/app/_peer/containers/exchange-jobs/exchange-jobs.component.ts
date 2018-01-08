import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ExchangeJob } from 'libs/models';

import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit {
  exchangeJobsLoading$: Observable<boolean>;
  exchangeJobsLoadingError$: Observable<boolean>;
  exchangeJobs$: Observable<ExchangeJob[]>;
  exchangeId: number;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.exchangeJobsLoading$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoading);
    this.exchangeJobsLoadingError$ = this.store.select(fromPeerAdminReducer.getExchangeJobsLoadingError);
    this.exchangeJobs$ = this.store.select(fromPeerAdminReducer.getExchangeJobs);

    this.exchangeId = this.route.snapshot.params.id;
  }

  // Events
  handleExchangeJobsGridReload() {
    this.store.dispatch(new fromExchangeJobsActions.LoadingExchangeJobs(this.exchangeId));
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromExchangeJobsActions.LoadingExchangeJobs(this.exchangeId));
  }
}
