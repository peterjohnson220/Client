import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromTicketActions from '../../actions/ticket.actions';
import { UserTicketItem } from '../../models';
import * as fromTicketReducer from '../../reducers';

@Component({
  selector: 'pf-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
  @Input() ticketId: number;

  ticket: UserTicketItem;

  ticketSubscription: Subscription;

  constructor(private store: Store<fromTicketReducer.State>) {
    this.ticketLoading$ = this.store.select(fromTicketReducer.getTicketLoading || fromTicketReducer.getCompanyDetailLoading);
    this.ticketLoadingError$ = this.store.select(fromTicketReducer.getTicketLoadingError || fromTicketReducer.getCompanyDetailLoadingError);
    this.ticket$ = this.store.select(fromTicketReducer.getUserTicket);

    this.ticketSubscription = this.ticket$.subscribe((userTicketResponse) => {
      if (userTicketResponse && userTicketResponse.TicketInfo.TicketId === this.ticketId) {
        this.ticket = userTicketResponse;
      }
    });
  }

  ticketLoading$: Observable<boolean>;
  ticketLoadingError$: Observable<boolean>;
  ticket$: Observable<UserTicketItem>;

  handleTicketReload() {
    this.store.dispatch(new fromTicketActions.LoadTicket(this.ticketId));
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketActions.LoadTicket(this.ticketId));

    // Done to ensure component is fully loaded before sending out success event. Otherwise selectTab call won't always work.
    setTimeout(() => {
      this.store.dispatch(new fromTicketActions.SelectTicketTab(this.ticketId));
    }, 0);
  }

  ngOnDestroy() {
    this.ticketSubscription.unsubscribe();
  }

  fieldChange(event: any) {
    // console.log(event);
  }
}
