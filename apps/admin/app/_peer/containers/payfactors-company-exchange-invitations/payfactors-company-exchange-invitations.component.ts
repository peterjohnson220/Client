import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { PayfactorsCompanyExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromPayfactorsCompanyExchangeInvitationsActions from '../../actions/payfactors-company-exchange-invitations.actions';

@Component({
  selector: 'pf-company-exchange-invitations',
  templateUrl: './payfactors-company-exchange-invitations.component.html',
  styleUrls: ['./payfactors-company-exchange-invitations.component.scss']
})

export class PayfactorsCompanyExchangeInvitationsComponent {
  payfactorsCompanyExchangeInvitationsLoading$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsLoadingError$: Observable<boolean>;
  payfactorsCompanyExchangeInvitationsGrid$: Observable<GridDataResult>;
  selectedCompanyInvitation: PayfactorsCompanyExchangeInvitation;
  exchangeId: number;
  collapse = false;
  pageRowIndex: number = null;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.payfactorsCompanyExchangeInvitationsLoading$
        = this.store.select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoading);
    this.payfactorsCompanyExchangeInvitationsLoadingError$
        = this.store.select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsLoadingError);
    this.payfactorsCompanyExchangeInvitationsGrid$ = this.store.select(fromPeerAdminReducer.getPayfactorsCompanyExchangeInvitationsGrid);

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handlePayfactorsCompanyExchangeInvitationsGridReload() {
    this.store.dispatch(new fromPayfactorsCompanyExchangeInvitationsActions.LoadPayfactorsCompanyExchangeInvitations(this.exchangeId));
  }

  handleCellClick(event: any) {
    if (!this.collapse) { this.collapse = true; }
    this.selectedCompanyInvitation = event.dataItem;
    this.pageRowIndex = event.rowIndex;
  }

  handleCloseInvitationInfo() {
    this.collapse = false;
    this.pageRowIndex = null;
  }
}
