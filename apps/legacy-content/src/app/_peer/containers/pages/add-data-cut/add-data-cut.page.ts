import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromPeerDataReducers from '../../../reducers';
import { Store } from '@ngrx/store';
import { ExchangeMapSummary } from '../../../../../../../../libs/models/peer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'pf-add-data-cut-page',
  templateUrl: './add-data-cut.page.html',
  styleUrls: ['./add-data-cut.page.scss']
})
export class AddDataCutPageComponent implements OnInit, OnDestroy {


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
