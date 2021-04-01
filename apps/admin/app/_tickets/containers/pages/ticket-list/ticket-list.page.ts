import { Component, OnDestroy, ViewChild } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { environment } from 'environments/environment';

import { WindowRef } from 'libs/core/services';
import { AppConstants } from 'libs/constants';

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
  get SiteAdminUrl() { return AppConstants.SiteAdminUrl; }

  env = environment;
  activeId = 'tab-tickets';

  userTicketTabs: UserTicketTabItem[] = [];

  openTicket$: Observable<UserTicketTabItem>;
  loadingTicketTab$: Observable<number>;
  selectedTicketTab$: Observable<number>;

  openTicketSubscription: Subscription;

  private unsubscribe$ = new Subject();

  @ViewChild(TicketListComponent) ticketListComponent: TicketListComponent;

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
  }

  handleCloseTabClick(userTicketId: number, $event): void {
    if (userTicketId > 0) {
      this.activeId = 'tab-tickets';
      this.userTicketTabs = this.userTicketTabs.filter(tab  => tab.UserTicketId !== userTicketId);
      this.store.dispatch(new fromTicketActions.CloseTicket());
      $event.preventDefault();
    }
  }

  handleOpenTicketEvent(userTicket: UserTicketTabItem): void {
    if (userTicket) {
      if (this.userTicketTabs.some(tab => tab.UserTicketId === userTicket.UserTicketId)) {
        this.activeId = userTicket.UserTicketId.toString();
      } else {
        this.userTicketTabs.unshift(userTicket);
        this.activeId = userTicket.UserTicketId.toString();
      }
    }
  }

  handleExportClicked(): void {
    this.store.dispatch(new fromTicketListActions.ExportGrid(this.ticketListComponent.prepareFilter()));
  }
  navChanged(event) {
    if (event.nextId === 'tab-tickets') {
      this.ticketListComponent.checkForRefresh();
    }
  }
}
