import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';

@Component({
  selector: 'pf-company-exchange-invitation-info',
  templateUrl: './company-exchange-invitation-info.component.html',
  styleUrls: [ './company-exchange-invitation-info.component.scss' ]
})

export class CompanyExchangeInvitationInfoComponent {
  @Input() selectedCompanyInvitation: ExchangeInvitation;
  @Output() closeClicked = new EventEmitter();
  @Output() approveClicked = new EventEmitter();
  @Output() denyClicked = new EventEmitter();

  approvingCompanyInvitation$: Observable<boolean>;
  denyingCompanyInvitation$: Observable<boolean>;
  approvingError$: Observable<boolean>;
  denyingError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.approvingCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationApproving));
    this.denyingCompanyInvitation$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationDenying));
    this.approvingError$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationApprovingError));
    this.denyingError$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationDenyingError));
  }

  close() {
    this.closeClicked.emit();
  }

  approve() {
    this.approveClicked.emit(this.selectedCompanyInvitation);
  }

  deny() {
    this.denyClicked.emit(this.selectedCompanyInvitation);
  }
}
