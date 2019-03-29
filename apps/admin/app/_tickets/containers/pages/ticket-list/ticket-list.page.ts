import { Component, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';


import { WindowRef } from 'libs/core/services';

import { UserTicketTabItem } from '../../../models';
import * as fromTicketReducer from '../../../reducers';


@Component({
  selector: 'pf-ticket-list-page',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.scss']
})
export class TicketListPageComponent implements OnInit {
  userTicketTabs: UserTicketTabItem[] = [];
  selectedTicketId: number = null;

  openTicket$: Observable<UserTicketTabItem>;
  selectTicketTab$: Observable<number>;

  openTicketSubscription: Subscription;
  selectTicketTabSubscription: Subscription;

  @ViewChild(NgbTabset) tabSet: NgbTabset;

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
    this.openTicketSubscription = this.openTicket$.subscribe((userTicket) => { this.handleOpenTicketEvent(userTicket); });

    this.selectTicketTabSubscription = this.selectTicketTab$.subscribe((userTicketId) => {
      if (userTicketId > 0) {
        this.tabSet.select('tab-' + userTicketId);
      }
    });
  }

  handleCloseTabClick(userTicketId: number, $event): void {
    if (userTicketId > 0) {
      if (userTicketId === this.selectedTicketId) {
        this.tabSet.select('tab-tickets');
      }
      this.userTicketTabs = this.userTicketTabs.filter(tab  => tab.UserTicketId !== userTicketId);

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
}
