import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromExchangeExplorerContextInfoActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer-context-info.actions';
import { ComphubExchangeExplorerContextRequest } from 'libs/models/peer/requests/comphub-exchange-explorer-context-request.model';
import { ExchangeDataSet } from 'libs/models/comphub';

import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import { AbstractJobGrid, JobGridComponent } from '../../../../_shared/containers/job-grid/shared-job-grid';

@Component({
  selector: 'pf-peer-job-results',
  templateUrl: './peer-job-results.component.html'
})
export class PeerJobResultsComponent extends AbstractJobGrid implements OnInit, OnDestroy {
  selectedExchange$: Observable<ExchangeDataSet>;
  selectedExchangeJobId$: Observable<number>;

  selectedExchangeJobIdSubscription: Subscription;
  selectedExchangeSubscription: Subscription;

  @ViewChild(JobGridComponent, { static: true }) jobGrid: JobGridComponent;
  selectedExchangeId: number;
  selectedExchangeJobId: number;


  constructor(
    store: Store<fromComphubSharedReducer.State>,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>
  ) {
    super(store);
    this.selectedExchange$ = this.store.select(fromComphubSharedReducer.getActiveExchangeDataSet);
    this.selectedExchangeJobId$ = this.store.select(fromComphubSharedReducer.getSelectedExchangeJobId);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedExchangeSubscription = this.selectedExchange$.subscribe(exchange => {
      if (exchange) {
        this.selectedExchangeId = exchange.ExchangeId;
      }
    });
    this.selectedExchangeJobIdSubscription = this.selectedExchangeJobId$.subscribe(exchangeJobId => {
      if (!!exchangeJobId) {
        this.selectedExchangeJobId = exchangeJobId;
        this.resetGridContext();
        this.loadContext();
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.selectedExchangeSubscription.unsubscribe();
    this.selectedExchangeJobIdSubscription.unsubscribe();
  }

  private loadContext(): void {
    const request: ComphubExchangeExplorerContextRequest = {
      ExchangeId : this.selectedExchangeId,
      ExchangeJobIds : [ this.selectedExchangeJobId  ]
    };
    this.exchangeExplorerStore.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo({request: request}));
  }
}
