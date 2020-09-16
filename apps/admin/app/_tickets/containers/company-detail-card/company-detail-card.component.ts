import { Component, Input, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { CompanyNotesModalComponent } from 'libs/features/company/company-notes/containers/company-notes-modal';

import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { CompanyDetail, UserTicketTabItem } from '../../models';

@Component({
  selector: 'pf-company-detail-card',
  templateUrl: './company-detail-card.component.html',
  styleUrls: ['./company-detail-card.component.scss']
})
export class CompanyDetailCardComponent {
  @Input() companyDetail: CompanyDetail;
  @ViewChild(CompanyNotesModalComponent, { static: true }) companyNotesModal: CompanyNotesModalComponent;

  constructor(private store: Store<fromTicketReducer.State>) {}

  openTicket(ticket: UserTicketTabItem) {
    if (ticket) {
      this.store.dispatch(new fromTicketActions.OpenTicket(ticket));
    }
  }

  public openNotesModal($event: any, companyId: number, companyName: string) {
    $event.stopPropagation();
    this.companyNotesModal.open(companyId, companyName, true);
  }
}
