import { Component, Input } from '@angular/core';

import { AsyncStateObj } from 'libs/models/state';

@Component({
  selector: 'pf-new-exchange-participants',
  templateUrl: './new-exchange-participants.component.html',
  styleUrls: ['./new-exchange-participants.component.scss']
})
export class NewExchangeParticipantsComponent {
  @Input() companyNames: AsyncStateObj<string[]>;

  constructor() { }
}
