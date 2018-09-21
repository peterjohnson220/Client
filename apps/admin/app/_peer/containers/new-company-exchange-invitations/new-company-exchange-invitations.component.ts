import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromNewCompanyExchangeInvitationsActions from '../../actions/new-company-exchange-invitations.actions';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

@Component({
  selector: 'pf-new-company-exchange-invitations',
  templateUrl: './new-company-exchange-invitations.component.html',
  styleUrls: ['./new-company-exchange-invitations.component.scss']
})

export class NewCompanyExchangeInvitationsComponent implements OnInit, OnDestroy {
  newCompanyExchangeInvitationsLoading$: Observable<boolean>;
  newCompanyExchangeInvitationsLoadingError$: Observable<boolean>;
  newCompanyExchangeInvitationsGrid$: Observable<GridDataResult>;
  companyInvitationInfoOpen$: Observable<boolean>;
  selectedCompanyInvitation$: Observable<ExchangeInvitation>;
  selectedCompanyInvitation: ExchangeInvitation;
  pageRowIndex$: Observable<number>;
  pageRowIndex: number;
  exchangeId: number;

  selectedCompanyInvitationSubscription: Subscription;
  pageRowIndexSubscription: Subscription;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.newCompanyExchangeInvitationsLoading$ = this.store.pipe(select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsLoading));
    this.newCompanyExchangeInvitationsLoadingError$
      = this.store.pipe(select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsLoadingError));
    this.newCompanyExchangeInvitationsGrid$ = this.store.pipe(select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsGrid));
    this.companyInvitationInfoOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationInfoOpen));
    this.selectedCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getSelectedCompanyExchangeInvitation));
    this.pageRowIndex$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationPageRowIndex));

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handleNewCompanyExchangeInvitationsGridReload() {
    this.store.dispatch(new fromNewCompanyExchangeInvitationsActions.LoadNewCompanyExchangeInvitations(this.exchangeId));
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

  handleApproveCompanyInvitation(companyInvitation: ExchangeInvitation) {
    // NOT IMPLEMENTED
    // this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation(companyInvitation));
  }

  handleDenyCompanyInvitation(companyInvitation: ExchangeInvitation) {
    // NOT IMPLEMENTED
    // this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitation(companyInvitation));
  }

  ngOnInit() {
    this.selectedCompanyInvitationSubscription = this.selectedCompanyInvitation$.subscribe(selectedInvitation => {
      this.selectedCompanyInvitation = selectedInvitation;
    });
    this.pageRowIndexSubscription = this.pageRowIndex$.subscribe(pri => {
      this.pageRowIndex = pri;
    });
  }

  ngOnDestroy() {
    this.handleCloseInvitationInfo();
    this.selectedCompanyInvitationSubscription.unsubscribe();
    this.pageRowIndexSubscription.unsubscribe();
  }
}
