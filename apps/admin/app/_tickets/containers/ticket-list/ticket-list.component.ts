import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { UserTicketGridItem } from '../../models';

@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit {
  private selectedTicketId: number;

  ticketListLoading$: Observable<boolean>;
  ticketListLoadingError$: Observable<boolean>;
  ticketListItems$: Observable<UserTicketGridItem[]>;

  constructor(private store: Store<fromTicketReducer.State>) {
    this.ticketListLoading$ = this.store.select(fromTicketReducer.getTicketListLoading);
    this.ticketListLoadingError$ = this.store.select(fromTicketReducer.getTicketListLoadingError);
    this.ticketListItems$ = this.store.select(fromTicketReducer.getTickets);
  }

  handleTicketGridReload() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
  }

  handleCellClick(cellClickEvent: any): void {
    this.selectedTicketId = cellClickEvent.dataItem.Id;
  }

  handleCellDoubleClick(): void {
    if (this.selectedTicketId !== 0) {
      this.store.dispatch(new fromTicketActions.OpenTicket(this.selectedTicketId));
    }
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
  }
}
