import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { TabStripComponent } from '@progress/kendo-angular-layout';
import { Observable, Subscription } from 'rxjs';

import { WindowRef } from 'libs/core/services';

import { UserTicketTabItem } from '../../../models/user-ticket-tab-item.model';
import * as fromTicketReducer from '../../../reducers';

@Component({
  selector: 'pf-ticket-list-page',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss']
})
export class TicketListPageComponent implements OnInit {
  userTicketTabs: UserTicketTabItem[] = [];
  selectedTicketId: number = null;

  openTicket$: Observable<number>;
  selectTicketTab$: Observable<number>;

  openTicketSubscription: Subscription;
  selectTicketTabSubscription: Subscription;

  @ViewChild(TabStripComponent) tabStrip: TabStripComponent;

  constructor(private window: WindowRef, private store: Store<fromTicketReducer.State>) {
    this.openTicket$ = this.store.select(fromTicketReducer.getOpenedTicket);
    this.selectTicketTab$ = this.store.select(fromTicketReducer.getSelectedTabTicket);

    this.configureTicketEvents();
  }

  ngOnInit() {
  }

  handleBackButtonClick(): void {
    this.window.nativeWindow.location = '/ng/site-admin/navigation';
  }

  configureTicketEvents(): void {
    this.openTicketSubscription = this.openTicket$.subscribe((userTicketId) => { this.handleOpenTicketEvent(userTicketId); });

    this.selectTicketTabSubscription = this.selectTicketTab$.subscribe((userTicketId) => {
      if (userTicketId) {
        this.tabStrip.selectTab(this.findUserTicketIndex(userTicketId) + 1);
      }
    });
  }

  handleTabSelect(event: any): void {
    const ticket = event.index === 0 ? null : this.userTicketTabs[ event.index - 1 ];

    this.selectedTicketId = ticket === null ? null : ticket.UserTicketId;
  }

  handleCloseTabClick(userTicketId: number): void {
    const index = this.findUserTicketIndex(userTicketId);

    if (index !== -1) {
      if (userTicketId === this.selectedTicketId) {
        this.tabStrip.selectTab(0);
      }

      this.userTicketTabs.splice(index, 1);
    }
  }

  findUserTicketIndex(userTicketId: number): number {
    return this.userTicketTabs.findIndex(utt => utt.UserTicketId === userTicketId);
  }

  handleOpenTicketEvent(userTicketId: number): void {
    if (userTicketId && this.findUserTicketIndex(userTicketId) === -1) {
      this.userTicketTabs.unshift({
        UserTicketId: userTicketId,
        Title: userTicketId.toString()
      });
    }
  }
}
