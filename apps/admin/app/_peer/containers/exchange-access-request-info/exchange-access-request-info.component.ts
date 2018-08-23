import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ExchangeAccessRequest } from 'libs/models/peer';

@Component({
  selector: 'pf-exchange-access-requests-info',
  templateUrl: './exchange-access-request-info.component.html',
  styleUrls: [ './exchange-access-request-info.component.scss' ]
})

export class ExchangeAccessRequestInfoComponent {
  @Input() selectedAccessRequest: ExchangeAccessRequest;
  @Output() closeClicked = new EventEmitter();

  close() {
    this.closeClicked.emit();
  }
}
