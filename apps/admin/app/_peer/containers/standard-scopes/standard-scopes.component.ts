import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models/peer';
import * as fromLibsPeerExchangeExplorerExchangeScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeExplorerMapComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer-map';
import * as fromSaveExchangeScopeActions from 'libs/features/peer/save-exchange-scope/actions';
import * as fromSaveExchangeScopeReducer from 'libs/features/peer/save-exchange-scope/reducers';
import * as fromLibsSearchReducer from 'libs/features/search/search/reducers';

import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-standard-scopes',
  templateUrl: './standard-scopes.component.html',
  styleUrls: ['./standard-scopes.component.scss']
})
export class StandardScopesComponent implements OnInit {
  @ViewChild(ExchangeExplorerMapComponent, { static: true }) map: ExchangeExplorerMapComponent;
  @ViewChild(ExchangeExplorerComponent, { static: true }) exchangeExplorer: ExchangeExplorerComponent;

  exchangeId: number;

  exchange$: Observable<Exchange>;
  numberOfSelections$: Observable<number>;

  constructor(private route: ActivatedRoute, private store: Store<fromSaveExchangeScopeReducer.State>, private sharedPeerStore: Store<fromPeerAdminReducer.State>) {
    this.exchangeId = +this.route.snapshot.parent.params.id;
    this.exchange$ = this.sharedPeerStore.pipe(select(fromPeerAdminReducer.getManageExchange));
    this.numberOfSelections$ = this.sharedPeerStore.pipe(select(fromLibsSearchReducer.getOverallFilterSelectionsCount));
  }

  ngOnInit() {
    this.store.dispatch(new fromLibsPeerExchangeExplorerExchangeScopeActions.SetIncludeCompanyScopes(false));
    this.store.dispatch(new fromLibsPeerExchangeExplorerExchangeScopeActions.SetIncludeStandardScopes(true));

    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            exchangeId: this.exchangeId,
            isExchangeSpecific: true,
            includeDisabledFilters: true
          }
        }
      }
    } as MessageEvent;
    this.exchangeExplorer.onMessage(setContextMessage);
  }

  handleCreateScopeClicked() {
    this.store.dispatch(new fromSaveExchangeScopeActions.OpenSaveExchangeScopeModal());
  }

  handleUpsertExchangeScopeEvent(scopeItem: any) {
    this.sharedPeerStore.dispatch(new fromLibsPeerExchangeExplorerExchangeScopeActions.UpsertExchangeScope({
      ExchangeId: this.exchangeId,
      ExchangeScopeId: -1,
      ExchangeScopeName: scopeItem.Name,
      ExchangeScopeDescription: scopeItem.Description ? scopeItem.Description : "",
      IsDefault: scopeItem.IsDefault,
      CompanyPayMarketIdsToDefaultFor: scopeItem.CompanyPayMarketIdsToDefaultFor,
      IsStandardScope: true
    }));
  }
}
