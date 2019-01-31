import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { Exchange, ExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromPayfactorsCompanyExchangeInvitationsActions from '../../actions/payfactors-company-exchange-invitations.actions';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

@Component({
  selector: 'pf-company-exchange-invitations',
  templateUrl: './payfactors-company-exchange-invitations.component.html',
  styleUrls: ['./payfactors-company-exchange-invitations.component.scss']
})

export class PayfactorsCompanyExchangeInvitationsComponent implements OnInit, OnDestroy {
  exchange$: Observable<Exchange>;
  exchange: Exchange;
  payfactorsCompanyExchangeInvitationsLoading$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsLoadingError$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsGrid$: Observable<GridDataResult>;
  companyInvitationInfoOpen$: Observable<boolean>;
  selectedCompanyInvitation$: Observable<ExchangeInvitation>;
  selectedCompanyInvitation: ExchangeInvitation;
  pageRowIndex$: Observable<number>;
  pageRowIndex: number;
  exchangeId: number;
  approveInvitationModalTitle = 'Approve Company Invitation';
  approveInvitationModalOpen$: Observable<boolean>;
  approvingCompanyInvitation$: Observable<boolean>;
  denyInvitationModalTitle = 'Deny Company Invitation';
  denyInvitationModalOpen$: Observable<boolean>;
  denyingCompanyInvitation$: Observable<boolean>;

  selectedCompanyInvitationSubscription: Subscription;
  pageRowIndexSubscription: Subscription;
  exchangeSubscription: Subscription;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.payfactorsCompanyExchangeInvitationsLoading$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoading));
    this.payfactorsCompanyExchangeInvitationsLoadingError$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoadingError));
    this.payfactorsCompanyExchangeInvitationsGrid$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsGrid));
    this.companyInvitationInfoOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationInfoOpen));
    this.selectedCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getSelectedCompanyExchangeInvitation));
    this.pageRowIndex$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationPageRowIndex));
    this.approveInvitationModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationApproveModalOpen));
    this.approvingCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationApproving));
    this.denyInvitationModalOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationDenyModalOpen));
    this.denyingCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationDenying));
    this.exchange$ = this.store.pipe(select(fromPeerAdminReducer.getManageExchange));

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  get approveModalText(): string {
    return 'Please select who you would like to notify that the company <strong>'
      + (this.selectedCompanyInvitation ? this.selectedCompanyInvitation.CompanyName : '')
      + '</strong> has been approved and added to the <strong>'
      + (this.exchange ? this.exchange.ExchangeName : '')
      + '</strong> exchange.';
  }

  get denyModalText(): string {
    return 'This action will deny the company <strong>' + (this.selectedCompanyInvitation ? this.selectedCompanyInvitation.CompanyName : '')
      + '</strong> access to the <strong>' + (this.exchange ? this.exchange.ExchangeName : '')
      + '</strong> exchange. The requestor will be notified about the denial of the invitation.';
  }

  // Events
  handlePayfactorsCompanyExchangeInvitationsGridReload() {
    this.store.dispatch(new fromPayfactorsCompanyExchangeInvitationsActions.LoadPayfactorsCompanyExchangeInvitations(this.exchangeId));
  }

  handleCellClick(event: any) {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationInfo({
      selectedCompanyInvitation: event.dataItem,
      pageRowIndex: event.rowIndex
    }));
  }

  handleCloseInvitationInfo() {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationInfo());
  }

  handleApproveCompanyInvitation(approveObj: any) {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation(approveObj));
  }

  handleDenyCompanyInvitation(reason: string) {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitation(reason));
  }

  handleCloseApproveModal() {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationApproveModal());
  }

  handleCloseDenyModal() {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.CloseCompanyInvitationDenyModal());
  }

  ngOnInit() {
    this.selectedCompanyInvitationSubscription = this.selectedCompanyInvitation$.subscribe(selectedInvitation => {
      this.selectedCompanyInvitation = selectedInvitation;
    });
    this.pageRowIndexSubscription = this.pageRowIndex$.subscribe(pri => {
      this.pageRowIndex = pri;
    });
    this.exchangeSubscription = this.exchange$.subscribe(e => {
      this.exchange = e;
    });
  }

  ngOnDestroy() {
    this.handleCloseInvitationInfo();
    this.selectedCompanyInvitationSubscription.unsubscribe();
    this.pageRowIndexSubscription.unsubscribe();
    this.exchangeSubscription.unsubscribe();
  }
}
