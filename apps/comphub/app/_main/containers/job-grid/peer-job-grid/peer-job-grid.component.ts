import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromExchangeExplorerContextInfoActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer-context-info.actions';
import { ComphubExchangeExplorerContextRequest } from 'libs/models/peer/requests/comphub-exchange-explorer-context-request.model';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer';

import * as fromComphubMainReducer from '../../../reducers';
import * as fromJobGridActions from '../../../actions/job-grid.actions';
import { ExchangeDataSet } from '../../../models';
import { AbstractJobGrid, JobGridComponent } from '../shared-job-grid';

@Component({
  selector: 'pf-peer-job-grid',
  templateUrl: './peer-job-grid.component.html'
})
export class PeerJobGridComponent extends AbstractJobGrid implements OnInit, OnDestroy {
  selectedExchange$: Observable<ExchangeDataSet>;
  selectedExchangeJobId$: Observable<number>;
  filterContext$: Observable<BaseExchangeDataSearchRequest>;

  selectedExchangeJobIdSubscription: Subscription;
  selectedExchangeSubscription: Subscription;
  filterContextSubscription: Subscription;

  @ViewChild(JobGridComponent, { static: true }) jobGrid: JobGridComponent;
  selectedExchangeId: number;
  selectedExchangeJobId: number;
  filterContext: BaseExchangeDataSearchRequest;

  constructor(
    store: Store<fromComphubMainReducer.State>,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
  ) {
    super(store);
    this.selectedExchange$ = this.store.select(fromComphubMainReducer.getActiveExchangeDataSet);
    this.selectedExchangeJobId$ = this.store.select(fromComphubMainReducer.getSelectedExchangeJobId);
    this.filterContext$ = this.exchangeExplorerContextService.selectFilterContext();
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
        this.jobGrid.resetGridContext();
        this.loadContext();
      }
    });
    this.filterContextSubscription = this.filterContext$.subscribe(request => {
      if (request?.FilterContext?.ExchangeJobId === this.selectedExchangeJobId) {
        this.store.dispatch(new fromJobGridActions.GetPeerJobData());
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.selectedExchangeSubscription.unsubscribe();
    this.selectedExchangeJobIdSubscription.unsubscribe();
    this.filterContextSubscription.unsubscribe();
  }

  private loadContext(): void {
    const request: ComphubExchangeExplorerContextRequest = {
      ExchangeId : this.selectedExchangeId,
      ExchangeJobId : this.selectedExchangeJobId
    };
    this.exchangeExplorerStore.dispatch(new fromExchangeExplorerContextInfoActions.LoadContextInfo(request));
  }
}
