import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ExchangeInvitation } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromCompanyExchangeInvitationInfoActions from '../../actions/company-exchange-invitation-info.actions';

@Component({
  selector: 'pf-company-exchange-invitation-info',
  templateUrl: './company-exchange-invitation-info.component.html',
  styleUrls: [ './company-exchange-invitation-info.component.scss' ]
})

export class CompanyExchangeInvitationInfoComponent {
  @Input() selectedCompanyInvitation: ExchangeInvitation;
  @Output() closeClicked = new EventEmitter();

  approvingError$: Observable<boolean>;
  denyingError$: Observable<boolean>;

  constructor(
    private store: Store<fromPeerAdminReducer.State>
  ) {
    this.approvingError$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationApprovingError));
    this.denyingError$ = this.store.pipe(select(fromPeerAdminReducer.getCompanyExchangeInvitationDenyingError));
  }

  close() {
    this.closeClicked.emit();
  }

  approve() {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationApproveModal());
  }

  deny() {
    this.store.dispatch(new fromCompanyExchangeInvitationInfoActions.OpenCompanyInvitationDenyModal());
  }
}
