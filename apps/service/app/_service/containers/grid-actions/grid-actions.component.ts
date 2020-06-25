import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { GroupedListItem } from 'libs/models/list';

import * as fromServicePageActions from '../../actions/service-page.actions';
import * as fromServicePageReducer from '../../reducers';
import { TicketListMode } from '../../models';

@Component({
  selector: 'pf-service-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent {
  @Input() userId: number;

  ticketStates$: Observable<AsyncStateObj<GroupedListItem[]>>;
  selectedTicketStates$: Observable<string[]>;
  selectedTicketListMode: TicketListMode;
  ticketListModes: string[] = [ TicketListMode.MyTickets, TicketListMode.AllCompanyTickets ];

  constructor(
    private store: Store<fromServicePageReducer.State>
  ) {
    this.ticketStates$ = this.store.select(fromServicePageReducer.getTicketStates);
    this.selectedTicketStates$ = this.store.select(fromServicePageReducer.getSelectedTicketStates);
    this.selectedTicketListMode = TicketListMode.MyTickets;
  }

  handleSelectedStatesChanged(ticketStates: string[]): void {
    this.store.dispatch(new fromServicePageActions.UpdateSelectedTicketStates({
      ticketStateValues: ticketStates
    }));
  }

  handleSelectedTicketListModeChanged(event: any): void {
    this.store.dispatch(new fromServicePageActions.SetTicketListMode({
        listType: this.selectedTicketListMode,
        userId: this.userId
      }
    ));
  }
}
