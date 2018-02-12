import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { ExchangeMapSummary } from 'libs/models/peer';

import * as fromPeerDataReducers from '../../reducers';

@Component({
  selector: 'pf-peer-data-cut-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {
  peerMapSummarySubscription: Subscription;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapSummary: ExchangeMapSummary;

  constructor(private store: Store<fromPeerDataReducers.State>) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
  }

  getMapStats() {
    return JSON.stringify(this.peerMapSummary);
  }

  ngOnInit(): void {
    this.peerMapSummarySubscription = this.peerMapSummary$.subscribe(summary => {
      this.peerMapSummary = summary;
    });
  }

  ngOnDestroy(): void {
    this.peerMapSummarySubscription.unsubscribe();
  }
}
