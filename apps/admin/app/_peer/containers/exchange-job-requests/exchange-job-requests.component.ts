import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { Exchange, ExchangeJobRequest } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

@Component({
  selector: 'pf-exchange-job-requests',
  templateUrl: './exchange-job-requests.component.html',
  styleUrls: ['./exchange-job-requests.component.scss']
})

export class ExchangeJobRequestsComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchange: Exchange;
  exchangeJobRequestsLoading$: Observable<boolean>;
  exchangeJobRequestsLoadingError$: Observable<boolean>;
  exchangeJobRequestsGrid$: Observable<GridDataResult>;
  jobRequestInfoOpen$: Observable<boolean>;
  selectedJobRequest$: Observable<ExchangeJobRequest>;
  selectedJobRequest: ExchangeJobRequest;
  pageRowIndex$: Observable<number>;
  pageRowIndex: number;
  exchangeId: number;
  denyRequestModalTitle = 'Deny Job Request';
  denyRequestModalOpen$: Observable<boolean>;
  denyingJobRequest$: Observable<boolean>;
  approveRequestModalTitle = 'Approve Job Request';
  approveRequestModalOpen$: Observable<boolean>;
  approvingJobRequest$: Observable<boolean>;

  selectedJobRequestSubscription: Subscription;
  pageRowIndexSubscription: Subscription;
  exchangeSubscription: Subscription;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.exchangeJobRequestsLoading$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestsLoading));
    this.exchangeJobRequestsLoadingError$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestsLoadingError));
    this.exchangeJobRequestsGrid$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestsGrid));
    this.jobRequestInfoOpen$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestInfoOpen));
    this.selectedJobRequest$ = this.store.pipe(select(fromPeerAdminReducer.getSelectedExchangeJobRequest));
    this.pageRowIndex$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestPageRowIndex));
    this.denyRequestModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestDenyModalOpen));
    this.denyingJobRequest$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestDenying));
    this.approveRequestModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestApproveModalOpen));
    this.approvingJobRequest$ = this.store.pipe(select(fromPeerAdminReducer.getExchangeJobRequestApproving));
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  get denyModalText(): string {
    return 'This action will deny the <strong>' + (this.selectedJobRequest ? this.selectedJobRequest.JobTitle : 'job')
      + '</strong> from being added to the <strong>' + (this.exchange ? this.exchange.ExchangeName : '')
      + '</strong> exchange.';
  }

  get approveModalText(): string {
    return 'Please select who you would like to notify that the <strong>'
      + (this.selectedJobRequest ? this.selectedJobRequest.JobTitle : '')
      + '</strong> job has been approved and added to the <strong>'
      + (this.exchange ? this.exchange.ExchangeName : '')
      + '</strong> exchange.';
  }

  // Events
  handleExchangeJobRequestsGridReload() {
    this.store.dispatch(new fromExchangeJobRequestsActions.LoadExchangeJobRequests(this.exchangeId));
  }

  handleCellClick(event: any) {
    this.store.dispatch(new fromExchangeJobRequestsActions.OpenJobRequestInfo({
      selectedJobRequest: event.dataItem,
      pageRowIndex: event.rowIndex
    }));
  }

  handleCloseRequestInfo() {
    this.store.dispatch(new fromExchangeJobRequestsActions.CloseJobRequestInfo());
  }

  handleApproveJobRequest(approveObj: any) {
    this.store.dispatch(new fromExchangeJobRequestsActions.ApproveExchangeJobRequest(approveObj));
  }

  handleDenyJobRequest(reason: string) {
    this.store.dispatch(new fromExchangeJobRequestsActions.DenyExchangeJobRequest(reason));
  }

  handleCloseDenyModal() {
    this.store.dispatch(new fromExchangeJobRequestsActions.CloseJobRequestDenyModal());
  }

  handleCloseApproveModal() {
    this.store.dispatch(new fromExchangeJobRequestsActions.CloseJobRequestApproveModal());
  }

  ngOnInit() {
    this.selectedJobRequestSubscription = this.selectedJobRequest$.subscribe(selectedRequest => {
      this.selectedJobRequest = selectedRequest;
    });
    this.pageRowIndexSubscription = this.pageRowIndex$.subscribe(pri => {
      this.pageRowIndex = pri;
    });
    this.exchangeSubscription = this.exchange$.subscribe(e => {
      this.exchange = e;
    });
  }

  ngOnDestroy() {
    this.handleCloseRequestInfo();
    this.selectedJobRequestSubscription.unsubscribe();
    this.pageRowIndexSubscription.unsubscribe();
    this.exchangeSubscription.unsubscribe();
  }
}
