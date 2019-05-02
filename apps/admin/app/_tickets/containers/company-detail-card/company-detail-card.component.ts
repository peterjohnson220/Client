import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromTicketActions from '../../actions/ticket.actions';
import { CompanyDetail, UserTicketTabItem } from '../../models';
import * as fromTicketReducer from '../../reducers';

@Component({
  selector: 'pf-company-detail-card',
  templateUrl: './company-detail-card.component.html',
  styleUrls: ['./company-detail-card.component.scss']
})
export class CompanyDetailCardComponent {
  @Input() companyDetail: CompanyDetail;

  constructor(private store: Store<fromTicketReducer.State>) {}

  openTicket(ticket: UserTicketTabItem) {
    if (ticket) {
      this.store.dispatch(new fromTicketActions.OpenTicket(ticket));
    }
  }
}
