import {Component, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as fromTicketListActions from '../../actions/ticket-list.actions';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import { UserTicketGridItem, UserTicketTabItem } from '../../models';

@Component({
  selector: 'pf-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, OnDestroy {
  private selectedTicket: UserTicketTabItem;

  ticketListLoading$: Observable<boolean>;
  ticketListLoadingError$: Observable<boolean>;
  ticketListItems$: Observable<UserTicketGridItem[]>;
  dirty$: Observable<boolean>;
  dirtySubscription: Subscription;
  private unsubscribe$ = new Subject();

  isDirty = false;

  constructor(private store: Store<fromTicketReducer.State>) {
    this.ticketListLoading$ = this.store.select(fromTicketReducer.getTicketListLoading);
    this.ticketListLoadingError$ = this.store.select(fromTicketReducer.getTicketListLoadingError);
    this.ticketListItems$ = this.store.select(fromTicketReducer.getTickets);
    this.dirty$ = this.store.select(fromTicketReducer.getDirtyGridState);

    this.dirtySubscription = this.dirty$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.isDirty = v;
    });
  }

  handleTicketGridReload() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
  }

  handleCellClick(cellClickEvent: any): void {
    const ut: UserTicketTabItem = {
      UserTicketId: cellClickEvent.dataItem.Id,
      Title: cellClickEvent.dataItem.Description
    };

    this.selectedTicket = ut;
  }

  handleCellDoubleClick(): void {
    if (this.selectedTicket) {
      this.store.dispatch(new fromTicketActions.OpenTicket(this.selectedTicket));
    }
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketListActions.LoadTickets({'UserTicket_State': 'New', 'Company_ID': 13}));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  checkForRefresh() {
    if (this.isDirty) {
      this.handleTicketGridReload();
    }
  }
}
