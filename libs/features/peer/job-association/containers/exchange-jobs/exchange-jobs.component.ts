import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromPeerJobsReducer from '../../reducers';
import * as peerExchangeJobsActions from '../../actions/exchange-jobs.actions';

import { ExchangeJob } from '../../models';

@Component({
  selector: 'pf-peer-job-association-exchange-jobs',
  templateUrl: './exchange-jobs.component.html',
  styleUrls: ['./exchange-jobs.component.scss']
})
export class ExchangeJobsComponent implements OnInit, OnDestroy {
  exchangeJobs: ExchangeJob[];
  totalExchangeJobs: number;
  exchangeJobsDataSubscription: Subscription;

  constructor(private store: Store<fromPeerJobsReducer.State>) { }

  ngOnInit() {
    this.exchangeJobsDataSubscription =
      this.store.select(fromPeerJobsReducer.getExchangeJobsData).subscribe(peerJobsData => {
        this.exchangeJobs = peerJobsData.data;
        this.totalExchangeJobs = peerJobsData.total;
    });
    this.store.dispatch(new peerExchangeJobsActions.LoadExchangeJobs());
  }

  ngOnDestroy() {
    this.exchangeJobsDataSubscription.unsubscribe();
  }
}
