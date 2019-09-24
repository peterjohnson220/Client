import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Exchange } from 'libs/models';
import { MapComponent } from 'libs/features/peer/map/containers/map/map.component';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import * as fromLibsPeerExchangeExplorerMapActions from 'libs/features/peer/exchange-explorer/actions/map.actions';
import * as fromLibsPeerExchangeExplorerExchangeScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';
import * as fromLibsExchangeExplorerReducer from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsSearchReducer from 'libs/features/search/reducers';

import * as fromExchangeScopeActions from '../../../actions/exchange-scope.actions';
import * as fromExportDataCutsActions from '../../../actions/export-data-cuts.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromPeerMapReducer from '../../../reducers';

@Component({
  selector: 'pf-exchange-map-new-page',
  templateUrl: './exchange-map-new.page.html',
  styleUrls: ['./exchange-map-new.page.scss']
})
export class ExchangeMapNewPageComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent, { static: true }) map: MapComponent;
  @ViewChild(ExchangeExplorerComponent, { static: true }) exchangeExplorer: ExchangeExplorerComponent;

  exchangeId: number;
  exchange$: Observable<Exchange>;
  initialMapMoveComplete$: Observable<boolean>;
  peerMapLoadingError$: Observable<boolean>;
  numberOfCompanySelections$: Observable<number>;
  numberOfSelections$: Observable<number>;
  peerMapCompaniesCount$: Observable<number>;
  exchangeJobIdsInScope$: Observable<number[]>;

  constructor(
    private route: ActivatedRoute,
    private libsExchangeExplorerStore: Store<fromLibsExchangeExplorerReducer.State>,
    private sharedPeerStore: Store<fromSharedPeerReducer.State>,
    private peerMapStore: Store<fromPeerMapReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {
    this.exchange$ = this.sharedPeerStore.pipe(select(fromSharedPeerReducer.getExchange));
    this.initialMapMoveComplete$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapInitialMapMoveComplete));
    this.peerMapLoadingError$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapLoadingError));
    this.numberOfCompanySelections$ = this.exchangeExplorerContextService.selectCountOfCompanyFiltersSelected();
    this.numberOfSelections$ = this.sharedPeerStore.pipe(select(fromLibsSearchReducer.getOverallFilterSelectionsCount));
    this.peerMapCompaniesCount$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapOrgCount));
    this.exchangeJobIdsInScope$ = this.sharedPeerStore.pipe(select(fromLibsExchangeExplorerReducer.getPeerMapExchangeJobIds));
    this.exchangeId = +this.route.snapshot.params.id;
  }

  handleSaveScopeClick() {
    this.peerMapStore.dispatch(new fromExchangeScopeActions.OpenSaveExchangeScopeModal());
  }

  handleUpsertExchangeScopeEvent(scopeItem: any) {
    // const zoomLevel = this.map.getZoomLevel(); TODO: Can we get this from the reducer instead?
    this.peerMapStore.dispatch(new fromLibsPeerExchangeExplorerExchangeScopeActions.UpsertExchangeScope({
      ExchangeScopeGuid: null,
      ExchangeScopeName: scopeItem.Name,
      ExchangeScopeDescription: scopeItem.Description
    }));
  }

  handleExportDataCutsClick() {
    this.peerMapStore.dispatch(new fromExportDataCutsActions.OpenExportDataCutsModal());
  }

  ngOnDestroy() {
    this.libsExchangeExplorerStore.dispatch(new fromLibsPeerExchangeExplorerMapActions.ResetState());
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
}
