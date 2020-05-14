import { Component, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';

import { WindowRef } from 'libs/core/services';
import { environment } from 'environments/environment';

import { TicketListComponent } from '../../ticket-list';
import { UserTicketTabItem } from '../../../models';
import * as fromTicketReducer from '../../../reducers';
import * as fromTicketActions from '../../../actions/ticket.actions';
import * as fromTicketListActions from '../../../actions/ticket-list.actions';

@Component({
  selector: 'pf-ticket-list-page',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss']
})
export class TicketListPageComponent implements OnDestroy {

  env = environment;

  userTicketTabs: UserTicketTabItem[] = [];
  selectedTicketId: number = null;

  openTicket$: Observable<UserTicketTabItem>;
  loadingTicketTab$: Observable<number>;
  selectedTicketTab$: Observable<number>;

  openTicketSubscription: Subscription;
  loadingTicketTabSubscription: Subscription;
  selectedTicketTabSubscription: Subscription;

  private unsubscribe$ = new Subject();

  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;
  @ViewChild(TicketListComponent, { static: false }) ticketListComponent: TicketListComponent;

  constructor(private window: WindowRef, private store: Store<fromTicketReducer.State>) {
    this.openTicket$ = this.store.select(fromTicketReducer.getOpenedTicket);
    this.loadingTicketTab$ = this.store.select(fromTicketReducer.getLoadingTabTicket);
    this.selectedTicketTab$ = this.store.select(fromTicketReducer.getSelectedTabTicket);

    this.configureTicketEvents();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  configureTicketEvents(): void {
    this.openTicketSubscription = this.openTicket$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userTicket) => { this.handleOpenTicketEvent(userTicket); });

    this.loadingTicketTabSubscription = this.loadingTicketTab$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userTicketId) => {
        if (userTicketId > 0) {
          this.tabSet.select('tab-' + userTicketId);
        }
      });

    this.selectedTicketTabSubscription = this.selectedTicketTab$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
        if (this.tabSet && v && v > 0) {
          this.tabSet.select('tab-' + v);
        }
      });
  }

  handleCloseTabClick(userTicketId: number, $event): void {
    if (userTicketId > 0) {
      if (userTicketId === this.selectedTicketId) {
        this.tabSet.select('tab-tickets');
      }
      this.userTicketTabs = this.userTicketTabs.filter(tab  => tab.UserTicketId !== userTicketId);

      this.store.dispatch(new fromTicketActions.CloseTicket());
      $event.preventDefault();
    }
  }

  handleOpenTicketEvent(userTicket: UserTicketTabItem): void {
    if (userTicket) {
      if (this.userTicketTabs.some(tab => tab.UserTicketId === userTicket.UserTicketId)) {
        this.tabSet.select('tab-' + userTicket.UserTicketId);
      } else {
        this.userTicketTabs.unshift(userTicket);
      }
    }
  }

  onTabChanged(event: NgbTabChangeEvent) {
    if (event.nextId !== 'tab-tickets' && event.activeId !== event.nextId) {
      const ticketId = parseInt(event.nextId.replace('tab-', ''), 10);
      this.store.dispatch(new fromTicketActions.SelectTicketTab(ticketId));
    }
    if (event.nextId === 'tab-tickets') {
      this.ticketListComponent.checkForRefresh();
      this.store.dispatch(new fromTicketActions.SelectTicketTab(0));
    }
  }

  handleExportClicked(): void {
    this.store.dispatch(new fromTicketListActions.ExportGrid(this.ticketListComponent.prepareFilter()));
  }
}
