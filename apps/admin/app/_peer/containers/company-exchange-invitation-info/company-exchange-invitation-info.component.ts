import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PayfactorsCompanyExchangeInvitation } from 'libs/models/peer';

@Component({
  selector: 'pf-company-exchange-invitation-info',
  templateUrl: './company-exchange-invitation-info.component.html',
  styleUrls: [ './company-exchange-invitation-info.component.scss' ]
})

export class CompanyExchangeInvitationInfoComponent {
  @Input() selectedCompanyInvitation: PayfactorsCompanyExchangeInvitation;
  @Output() closeClicked = new EventEmitter();

  close() {
    this.closeClicked.emit();
  }
}
