import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ofType } from '@ngrx/effects';

import { AsyncStateObj } from 'libs/models/state';
import { GroupedListItem } from 'libs/models/list';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromServicePageActions from '../../actions/service-page.actions';
import * as fromServicePageReducer from '../../reducers';
import { TicketListMode } from '../../models';

@Component({
  selector: 'pf-service-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent implements OnInit, OnDestroy {
  @Input() userId: number;

  ticketStates$: Observable<AsyncStateObj<GroupedListItem[]>>;
  selectedTicketStates$: Observable<string[]>;
  selectedTicketListMode: TicketListMode;
  ticketListModes: string[] = [ TicketListMode.MyTickets, TicketListMode.AllCompanyTickets ];

  loadViewConfigSuccessSubscription: Subscription;

  constructor(
    private store: Store<fromServicePageReducer.State>,
    private actionsSubject: ActionsSubject
  ) {
    this.ticketStates$ = this.store.select(fromServicePageReducer.getTicketStates);
    this.selectedTicketStates$ = this.store.select(fromServicePageReducer.getSelectedTicketStates);
    this.selectedTicketListMode = TicketListMode.MyTickets;
  }

  ngOnInit(): void {
    this.loadViewConfigSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.LOAD_VIEW_CONFIG_SUCCESS))
      .subscribe((action: fromPfDataGridActions.LoadViewConfigSuccess) => {
        this.handleSelectedTicketListModeChanged(false);
      });
  }

  ngOnDestroy() {
    this.loadViewConfigSuccessSubscription?.unsubscribe();
  }

  handleSelectedStatesChanged(ticketStates: string[]): void {
    this.store.dispatch(new fromServicePageActions.UpdateSelectedTicketStates({
      ticketStateValues: ticketStates
    }));
  }

  handleSelectedTicketListModeChanged(resetFilters: boolean = true): void {
    this.store.dispatch(new fromServicePageActions.SetTicketListMode({
        listType: this.selectedTicketListMode,
        userId: this.userId,
        resetFilter: resetFilters
      }
    ));
  }
}
