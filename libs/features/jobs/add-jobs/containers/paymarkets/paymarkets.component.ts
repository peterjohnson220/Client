import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromPaymarketActions from 'libs/features/jobs/add-jobs/actions/paymarkets.actions';
import * as fromPaymarketReducer from 'libs/features/jobs/add-jobs/reducers';

import { JobPayMarket } from 'libs/features/jobs/add-jobs/models';

@Component({
  selector: 'pf-paymarkets',
  templateUrl: './paymarkets.component.html',
  styleUrls: ['./paymarkets.component.scss']
})
export class PaymarketsComponent implements OnInit, OnDestroy {
  @Input() useSmallBizStyles: boolean;

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

  constructor(private store: Store<fromPaymarketReducer.State>) {
    this.paymarkets$ = this.store.select(fromPaymarketReducer.getPaymarkets);
    this.visiblePaymarkets$ = this.store.select(fromPaymarketReducer.getVisiblePaymarkets);
    this.defaultPaymarket$ = this.store.select(fromPaymarketReducer.getDefaultPaymarket);
    this.selectedPaymarkets$ = this.store.select(fromPaymarketReducer.getSelectedPaymarkets);
    this.loadingPaymarkets$ = this.store.select(fromPaymarketReducer.getLoadingPaymarkets);
    this.loadingPaymarketsError$ = this.store.select(fromPaymarketReducer.getLoadingPaymarketsError);
    this.searchTerm$ = this.store.select(fromPaymarketReducer.getSearchTerm);
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

