import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Exchange, ExchangeScopeItem, StatusEnum } from 'libs/models';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeExplorerMapComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer-map';
import * as fromLibsPeerExchangeExplorerExchangeScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';
import * as fromLibsPeerExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer.actions';
import * as fromLibsExchangeExplorerReducer from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsSearchReducer from 'libs/features/search/search/reducers';
import * as fromLibsExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromRootState from 'libs/state/state';

import * as fromExchangeScopeActions from '../../../actions/save-exchange-scope.actions';
import * as fromExportDataCutsActions from '../../../actions/export-data-cuts.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromPeerMapReducer from '../../../reducers';



@Component({
  selector: 'pf-exchange-map-page',
  templateUrl: './exchange-map.page.html',
  styleUrls: ['./exchange-map.page.scss']
})
export class ExchangeMapPageComponent implements OnInit, OnDestroy {
  @ViewChild(ExchangeExplorerMapComponent, { static: true }) map: ExchangeExplorerMapComponent;
  @ViewChild(ExchangeExplorerComponent, { static: true }) exchangeExplorer: ExchangeExplorerComponent;

  exchangeId: number;
  exchange$: Observable<Exchange>;
  peerMapLoadingError$: Observable<boolean>;
  numberOfCompanySelections$: Observable<number>;
  numberOfSelections$: Observable<number>;
  peerMapCompaniesCount$: Observable<number>;
  exchangeJobIdsInScope$: Observable<number[]>;
  exchangeScopeItems$: Observable<ExchangeScopeItem[]>;
  selectedExchangeScope$: Observable<ExchangeScopeItem>;
  isAdminOrImpersonating$: Observable<boolean>;

  StatusEnum = StatusEnum;

  constructor(
    private route: ActivatedRoute,
    private libsExchangeExplorerStore: Store<fromLibsExchangeExplorerReducer.State>,
    private store: Store<fromRootState.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private peerMapStore: Store<fromPeerMapReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {
    this.exchange$ = this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchange));
    this.peerMapLoadingError$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapLoadingError));
    this.numberOfCompanySelections$ = this.exchangeExplorerContextService.selectCountOfCompanyFiltersSelected();
    this.numberOfSelections$ = this.sharedPeerStore.pipe(select(fromLibsSearchReducer.getOverallFilterSelectionsCount));
    this.peerMapCompaniesCount$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapOrgCount));
    this.exchangeJobIdsInScope$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapExchangeJobIds));
    this.exchangeScopeItems$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducers.getExchangeScopes));
    this.selectedExchangeScope$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducers.getFilterContextScopeSelection));
    this.isAdminOrImpersonating$ = this.store.pipe(select(fromRootState.getIsAdminOrImpersonating));
    this.exchangeId = +this.route.snapshot.params.id;
  }

  handleSaveScopeClick() {
    this.peerMapStore.dispatch(new fromExchangeScopeActions.OpenSaveExchangeScopeModal());
  }

  handleUpsertExchangeScopeEvent(scopeItem: any) {
    this.peerMapStore.dispatch(new fromLibsPeerExchangeExplorerExchangeScopeActions.UpsertExchangeScope({
      ExchangeId: this.exchangeId,
      ExchangeScopeId: -1,
      ExchangeScopeName: scopeItem.Name,
      ExchangeScopeDescription: scopeItem.Description ? scopeItem.Description : "",
      IsDefault: scopeItem.IsDefault,
      CompanyPayMarketIdsToDefaultFor: scopeItem.CompanyPayMarketIdsToDefaultFor
    }));
  }

  handleExportDataCutsClick() {
    this.peerMapStore.dispatch(new fromExportDataCutsActions.OpenExportDataCutsModal());
  }

  ngOnDestroy() {
    this.libsExchangeExplorerStore.dispatch(new fromLibsPeerExchangeExplorerActions.ResetExchangeExplorerState());
  }

  ngOnInit() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {
            exchangeId: this.exchangeId,
            isExchangeSpecific: true
          }
        }
      }
    } as MessageEvent;
    this.exchangeExplorer.onMessage(setContextMessage);
  }

  isExportDisabled(): boolean {
    let exchangeIsPreliminary: boolean;
    let companyCountSufficient: boolean;
    let exchangeJobsInScope: boolean;
    let isSiteAdminOrImpersonating: boolean;


    this.exchange$.pipe(take(1)).subscribe(x => {
      exchangeIsPreliminary = x.Status === StatusEnum.Preliminary;
    });

    this.peerMapCompaniesCount$.pipe(take(1)).subscribe(x => {
      companyCountSufficient = x >= 5;
    });

    this.exchangeJobIdsInScope$.pipe(take(1)).subscribe(x => {
      exchangeJobsInScope = x?.length > 0;
    });

    this.isAdminOrImpersonating$.pipe(take(1)).subscribe(x => {
      isSiteAdminOrImpersonating = x;
    });

return !companyCountSufficient || !exchangeJobsInScope || (exchangeIsPreliminary && !isSiteAdminOrImpersonating);

  }
}
