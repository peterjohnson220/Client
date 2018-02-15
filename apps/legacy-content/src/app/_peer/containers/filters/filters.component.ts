import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ExchangeMapSummary, UpdateFilterSelections } from 'libs/models/peer';

import * as fromPeerDataReducers from '../../reducers';
import * as fromPeerMapActions from '../../actions/peer-map.actions';

@Component({
  selector: 'pf-peer-data-cut-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy {

  peerMapSummarySubscription: Subscription;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  peerMapSummary: ExchangeMapSummary;
  peerFilters$: Observable<any[]>;
  peerFiltersLoading$: Observable<boolean>;
  peerFiltersLoadingError$: Observable<boolean>;

  constructor(private store: Store<fromPeerDataReducers.State>) {
    this.peerMapSummary$ = this.store.select(fromPeerDataReducers.getPeerMapSummary);
    this.peerFilters$ = this.store.select(fromPeerDataReducers.getPeerFilters);
    this.peerFiltersLoading$ = this.store.select(fromPeerDataReducers.getPeerFiltersLoading);
    this.peerFiltersLoadingError$ = this.store.select(fromPeerDataReducers.getPeerFiltersLoadingError);
  }

  getMapStats() {
    return JSON.stringify(this.peerMapSummary);
  }

  handleSelectionChanged(filterSelection: UpdateFilterSelections) {
    this.store.dispatch(new fromPeerMapActions.UpdatePeerMapFilter(filterSelection));
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
