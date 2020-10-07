import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ExchangeScopeItem, ExchangeScopes, GenericKeyValue } from 'libs/models';

import * as fromPaymarketExchangeScopeActions from '../../../actions/paymarket-exchange-scope.actions';
import * as fromPaymarketExchangeScopeReducer from '../../../reducers';

@Component({
  selector: 'pf-paymarket-exchange-scope',
  templateUrl: './paymarket-exchange-scope.page.html',
  styleUrls: ['./paymarket-exchange-scope.page.scss']
})
export class PaymarketExchangeScopeComponent implements OnInit, OnDestroy {
  // Observables
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  exchangeScopes$: Observable<ExchangeScopes[]>;
  selectedExchangeScopes$: Observable<GenericKeyValue<number, number>[]>;

  // Subscriptions
  exchangeScopesSub: Subscription;
  selectedExchangeScopesSub: Subscription;

  // Members
  companyPayMarketId: number;
  exchanges: GenericKeyValue<number, string>[];
  exchangeScopes: ExchangeScopes[];
  exchangeScopeSelections: GenericKeyValue<number, number>[];

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromPaymarketExchangeScopeReducer.State>) {
    this.loading$ = store.pipe(select(fromPaymarketExchangeScopeReducer.getExchangeScopesIsLoading));
    this.loadingError$ = store.pipe(select(fromPaymarketExchangeScopeReducer.getExchangeScopeLoadingError));
    this.exchangeScopes$ = store.pipe(select(fromPaymarketExchangeScopeReducer.getExchangeScopes));
    this.selectedExchangeScopes$ = store.pipe(select(fromPaymarketExchangeScopeReducer.getSelectedExchangeScopes));
  }

  ngOnInit(): void {
    this.registerSubscriptions();

    // Get CompanyPayMarketId from query param
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || null;

    if (this.companyPayMarketId) {
      this.store.dispatch(
        new fromPaymarketExchangeScopeActions.LoadExchangeScopeSelections(this.companyPayMarketId)
      );
    }

    this.loadExchangeScopes();
  }

  ngOnDestroy(): void {
    this.destroySubscriptions();
  }

  registerSubscriptions(): void {
    // Subscriptions
    this.exchangeScopesSub = this.exchangeScopes$.subscribe( exchangeScopes => {
      this.exchangeScopes = exchangeScopes;
      this.exchanges = this.getExchanges();
    });

    this.selectedExchangeScopesSub = this.selectedExchangeScopes$.subscribe(selectedExchangeScopes => {
      this.exchangeScopeSelections = selectedExchangeScopes;
      this.store.dispatch(
        new fromPaymarketExchangeScopeActions.PublishExchangeScopeSelections(selectedExchangeScopes)
      );
    });
  }

  destroySubscriptions(): void {
    this.exchangeScopesSub.unsubscribe();
    this.selectedExchangeScopesSub.unsubscribe();
  }

  loadExchangeScopes(): void {
    this.store.dispatch(new fromPaymarketExchangeScopeActions.LoadExchangeScopes());
  }

  addRow(): void {
    this.store.dispatch(new fromPaymarketExchangeScopeActions.AddRow());
  }

  deleteRow(row: number): void {
    this.store.dispatch(new fromPaymarketExchangeScopeActions.DeleteRow(row));
  }

  selectExchange(row: number, event: GenericKeyValue<number, string>) {
    let exchangeId = null;
    if (event && event.Key) {
      exchangeId = event.Key;
    }
    this.store.dispatch(new fromPaymarketExchangeScopeActions.SelectExchange({
      Row: row,
      ExchangeId: exchangeId
    }));
  }

  selectScope(row: number, event: ExchangeScopeItem) {
    let scopeId = null;
    if (event && event.ExchangeScopeId) {
      scopeId = event.ExchangeScopeId;
    }
    this.store.dispatch(new fromPaymarketExchangeScopeActions.SelectScope({
      Row: row,
      ScopeId: scopeId
    }));
  }

  getScopesForRow(row: number): ExchangeScopeItem[] {
    const exchangeId = this.exchangeScopeSelections[row].Key;
    if (exchangeId > 0) {
      const exchangeScope = this.exchangeScopes.find(x => x.ExchangeId === exchangeId);
      if (exchangeScope && exchangeScope.ExchangeScopeItems) {
        return exchangeScope.ExchangeScopeItems;
      } else {
        return [];
      }
    }
  }

  disableScopeSelect(exchangeScopeSelection: GenericKeyValue<number, string>): boolean {
    return exchangeScopeSelection.Key <= 0;
  }

  getScopeSelectionForRow(row: number): ExchangeScopeItem {
    const exchangeId = this.exchangeScopeSelections[row].Key;
    if (exchangeId > 0) {
      const scopeId = this.exchangeScopeSelections[row].Value;
      const exchangeScopeItems = this.getScopesForRow(row);
      if (exchangeScopeItems && scopeId) {
        const exchangeScopeItem = exchangeScopeItems.find(x => x.ExchangeScopeId === scopeId);
        if (exchangeScopeItem) {
          return exchangeScopeItem;
        }
      } else {
        return null;
      }
    }
  }

  getExchanges(): GenericKeyValue<number, string>[] {
    const exchangeScopes: GenericKeyValue<number, string>[] = [];
    if (this.exchangeScopes) {
      this.exchangeScopes.filter(exchangeScope => {
        exchangeScopes.push({
          Key: exchangeScope.ExchangeId,
          Value: exchangeScope.ExchangeName
        });
      });
    }
    return exchangeScopes;
  }
}
