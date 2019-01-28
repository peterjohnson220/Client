import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PayMarket } from 'libs/models/paymarket';

import * as fromAddJobsReducer from '../../reducers';
import * as fromPaymarketActions from '../../actions/paymarkets.actions';
import { JobPayMarket } from '../../models';

@Component({
  selector: 'pf-paymarkets',
  templateUrl: './paymarkets.component.html',
  styleUrls: ['./paymarkets.component.scss']
})
export class PaymarketsComponent implements OnInit, OnDestroy {
  // Subscriptions
  searchTermSubscription: Subscription;

  // Observables
  paymarkets$: Observable<JobPayMarket[]>;
  visiblePaymarkets$: Observable<JobPayMarket[]>;
  defaultPaymarket$: Observable<number>;
  loadingPaymarkets$: Observable<boolean>;
  loadingPaymarketsError$: Observable<boolean>;
  selectedPaymarkets$: Observable<number[]>;
  searchTerm$: Observable<string>;

  filterString: string;
  selectedPaymarkets: number[];

  constructor(private store: Store<fromAddJobsReducer.State>) {
    this.paymarkets$ = this.store.select(fromAddJobsReducer.getPaymarkets);
    this.visiblePaymarkets$ = this.store.select(fromAddJobsReducer.getVisiblePaymarkets);
    this.defaultPaymarket$ = this.store.select(fromAddJobsReducer.getDefaultPaymarket);
    this.selectedPaymarkets$ = this.store.select(fromAddJobsReducer.getSelectedPaymarkets);
    this.loadingPaymarkets$ = this.store.select(fromAddJobsReducer.getLoadingPaymarkets);
    this.loadingPaymarketsError$ = this.store.select(fromAddJobsReducer.getLoadingPaymarketsError);
    this.searchTerm$ = this.store.select(fromAddJobsReducer.getSearchTerm);
    this.selectedPaymarkets = [];
  }
  ngOnInit(): void {
    this.searchTermSubscription = this.searchTerm$.subscribe(st => this.filterString = st);
  }

  ngOnDestroy(): void {
    this.searchTermSubscription.unsubscribe();
  }

  trackById(index: number, paymarket: JobPayMarket): number {
    return paymarket.CompanyPayMarketId;
  }

  handleSearchChanged(query: string): void {
    this.store.dispatch(new fromPaymarketActions.SetSearchTerm(query));
  }

  togglePaymarket(paymarket: JobPayMarket): void {
    this.store.dispatch(new fromPaymarketActions.TogglePaymarketSelection(paymarket.CompanyPayMarketId));
  }
}

