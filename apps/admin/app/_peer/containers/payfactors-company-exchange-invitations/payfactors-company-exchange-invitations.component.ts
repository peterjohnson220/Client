import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromPayfactorsCompanyExchangeInvitationsActions from '../../actions/payfactors-company-exchange-invitations.actions';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

@Component({
  selector: 'pf-company-exchange-invitations',
  templateUrl: './payfactors-company-exchange-invitations.component.html',
  styleUrls: ['./payfactors-company-exchange-invitations.component.scss']
})

export class PayfactorsCompanyExchangeInvitationsComponent implements OnInit, OnDestroy {
  payfactorsCompanyExchangeInvitationsLoading$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsLoadingError$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsGrid$: Observable<GridDataResult>;
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
    this.payfactorsCompanyExchangeInvitationsLoading$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoading));
    this.payfactorsCompanyExchangeInvitationsLoadingError$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoadingError));
    this.payfactorsCompanyExchangeInvitationsGrid$
        = this.store.pipe(select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsGrid));
    this.companyInvitationInfoOpen$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationInfoOpen));
    this.selectedCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getSelectedCompanyExchangeInvitation));
    this.pageRowIndex$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationPageRowIndex));

    this.exchangeId = this.route.snapshot.parent.params.id;
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

  handleApproveCompanyInvitation(companyInvitation: ExchangeInvitation) {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation(companyInvitation));
  }

  handleDenyCompanyInvitation(companyInvitation: ExchangeInvitation) {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitation(companyInvitation));
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
