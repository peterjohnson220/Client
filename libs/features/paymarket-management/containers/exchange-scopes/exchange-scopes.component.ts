import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { cloneDeep, orderBy } from 'lodash';

import { AsyncStateObj } from 'libs/models/state';
import { ExchangeScopeItem, ExchangeScopes } from 'libs/models/peer/exchange-scope';

import * as fromPayMarketManagementReducer from '../../reducers';
import * as fromExchangeScopesActions from '../../actions/exchange-scopes.actions';

@Component({
  selector: 'pf-exchange-scopes',
  templateUrl: './exchange-scopes.component.html',
  styleUrls: ['./exchange-scopes.component.scss']
})
export class ExchangeScopesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() reset = false;

  exchangeScopes$: Observable<AsyncStateObj<ExchangeScopes[]>>;
  selectedExchangeScopes$: Observable<AsyncStateObj<ExchangeScopes[]>>;

  exchangeScopesSub: Subscription;
  selectedExchangeScopesSub: Subscription;

  exchangeScopes: ExchangeScopes[];
  exchangeScopeItems: ExchangeScopeItem[];
  exchangeScopesFilter: ExchangeScopes[];
  exchangeScopeItemsFilter: ExchangeScopeItem[];
  selectedExchangeScopes: ExchangeScopes[];
  selectedExchangeId: number;
  exchangeScopeItemId: string;
  duplicateError = false;

  constructor(
    private store: Store<fromPayMarketManagementReducer.State>
  ) {
    this.exchangeScopes$ = this.store.select(fromPayMarketManagementReducer.getCompanyExchangeScopes);
    this.selectedExchangeScopes$ = this.store.select(fromPayMarketManagementReducer.getSelectedExchanges);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromExchangeScopesActions.LoadCompanyExchangeScopes());
    this.initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.reset?.currentValue) {
      this.resetExchangeScopes();
    }
  }

  ngOnDestroy(): void {
    this.exchangeScopesSub.unsubscribe();
    this.selectedExchangeScopesSub.unsubscribe();
  }

  selectExchange(exchangeId: number) {
    this.exchangeScopeItemId = null;
    if (!!exchangeId) {
      const selectedExchange = this.exchangeScopes.find(x => x.ExchangeId === exchangeId);
      this.selectedExchangeId = exchangeId;
      this.exchangeScopeItems = selectedExchange.ExchangeScopeItems;
      this.exchangeScopeItemsFilter = orderBy(this.exchangeScopeItems, [x => x.Name.toLowerCase()],  ['asc']);
    } else {
      this.selectedExchangeId = null;
    }
  }

  addExchangeScope(): void {
    const selectedExchange = cloneDeep(this.exchangeScopes.find(es => es.ExchangeId === this.selectedExchangeId));
    const selectedExchangeScopeItem = this.exchangeScopeItems.find(esi => esi.ExchangeScopeGuid === this.exchangeScopeItemId);
    if (!selectedExchange || !selectedExchangeScopeItem) {
      return;
    }
    selectedExchange.ExchangeScopeItems = [selectedExchangeScopeItem];
    this.duplicateError = this.selectedExchangeScopes.some(ses =>
      ses.ExchangeName === selectedExchange.ExchangeName &&
      ses.ExchangeScopeItems[0].ExchangeScopeGuid === selectedExchangeScopeItem.ExchangeScopeGuid
    );
    if (this.duplicateError) {
      return;
    }
    this.store.dispatch(new fromExchangeScopesActions.AddExchangeScope(selectedExchange));
  }

  removeDefaultScope(index: number): void {
    this.duplicateError = false;
    this.store.dispatch(new fromExchangeScopesActions.RemoveExchangeScope({exchangeScopeIndex: index}));
  }

  handleExchangeFilter(value: string) {
    this.exchangeScopesFilter = this.exchangeScopes.filter((s) => s.ExchangeName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handleScopeFilter(value: string) {
    this.exchangeScopeItemsFilter = this.exchangeScopeItems.filter((s) => s.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  private resetExchangeScopes(): void {
    this.duplicateError = false;
    this.selectedExchangeId = null;
    this.exchangeScopeItemId = null;
    this.store.dispatch(new fromExchangeScopesActions.ResetExchangeScopes());
  }

  private initSubscriptions(): void {
    this.exchangeScopesSub = this.exchangeScopes$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.exchangeScopes = asyncObj.obj;
        this.exchangeScopesFilter = asyncObj.obj;
      }
    });
    this.selectedExchangeScopesSub = this.selectedExchangeScopes$.subscribe(asyncObj => {
      if (!!asyncObj && !asyncObj.loading && !!asyncObj.obj) {
        this.selectedExchangeScopes = asyncObj.obj;
      }
    });
  }
}
