import { Component, Input } from '@angular/core';

import { TicketDetail } from '../../models';

@Component({
  selector: 'pf-ticket-detail-card',
  templateUrl: './ticket-detail-card.component.html',
  styleUrls: ['./ticket-detail-card.component.scss']
})
export class TicketDetailCardComponent {
  @Input() ticketDetail: TicketDetail;
}
