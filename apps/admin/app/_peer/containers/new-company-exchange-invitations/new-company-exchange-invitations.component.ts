import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { NewCompanyExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromNewCompanyExchangeInvitationsActions from '../../actions/new-company-exchange-invitations.actions';

@Component({
  selector: 'pf-new-company-exchange-invitations',
  templateUrl: './new-company-exchange-invitations.component.html',
  styleUrls: ['./new-company-exchange-invitations.component.scss']
})

export class NewCompanyExchangeInvitationsComponent {
  newCompanyExchangeInvitationsLoading$: Observable<boolean>;
  newCompanyExchangeInvitationsLoadingError$: Observable<boolean>;
  newCompanyExchangeInvitationsGrid$: Observable<GridDataResult>;
  selectedCompanyInvitation: NewCompanyExchangeInvitation;
  exchangeId: number;
  collapse = false;
  pageRowIndex: number = null;

  constructor(
    private store: Store<fromPeerAdminReducer.State>,
    private route: ActivatedRoute
  ) {
    this.newCompanyExchangeInvitationsLoading$ = this.store.select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsLoading);
    this.newCompanyExchangeInvitationsLoadingError$ = this.store.select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsLoadingError);
    this.newCompanyExchangeInvitationsGrid$ = this.store.select(fromPeerAdminReducer.getNewCompanyExchangeInvitationsGrid);

    this.exchangeId = this.route.snapshot.parent.params.id;
  }

  // Events
  handleNewCompanyExchangeInvitationsGridReload() {
    this.store.dispatch(new fromNewCompanyExchangeInvitationsActions.LoadNewCompanyExchangeInvitations(this.exchangeId));
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
