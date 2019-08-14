import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { TicketDetail } from '../../models';

import * as fromTicketReducer from '../../reducers';
import * as fromTicketSharedActions from '../../actions/ticket-shared.actions';

@Component({
  selector: 'pf-ticket-detail-card',
  templateUrl: './ticket-detail-card.component.html',
  styleUrls: ['./ticket-detail-card.component.scss']
})
export class TicketDetailCardComponent {
  @Input() ticketDetail: TicketDetail;

  constructor(public store: Store<fromTicketReducer.State>) { }

  openDetailsModal() {
    this.store.dispatch(new fromTicketSharedActions.UserDetailOpen(true));
    this.store.dispatch(new fromTicketSharedActions.GetUserDetail(this.ticketDetail.OpenedByUserId, this.ticketDetail.TicketId));
  }
}
