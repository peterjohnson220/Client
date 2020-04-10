import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions/pf-data-grid.actions';
import { AsyncStateObj } from 'libs/models/state';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import * as fromServicePageActions from '../../actions/service-page.actions';
import * as fromServicePageReducer from '../../reducers';
import { MultiSelectItemGroup, TicketListMode, ServicePageConfig } from '../../models';

@Component({
  selector: 'pf-service-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent {
  @Input() userId: number;

  ticketStates$: Observable<AsyncStateObj<MultiSelectItemGroup[]>>;
  selectedTicketStates$: Observable<string[]>;
  selectedTicketListMode: TicketListMode;
  ticketListModes: string[] = [ TicketListMode.MyTickets, TicketListMode.AllCompanyTickets ];

  constructor(
    private store: Store<fromServicePageReducer.State>,
    private pfGridStore: Store<fromPfGridReducer.State>
  ) {
    this.ticketStates$ = this.store.select(fromServicePageReducer.getTicketStates);
    this.selectedTicketStates$ = this.store.select(fromServicePageReducer.getSelectedTicketStates);
    this.selectedTicketListMode = TicketListMode.MyTickets;
  }

  handleSelectedStatesChanged(ticketStates: MultiSelectItemGroup[]): void {
    this.store.dispatch(new fromServicePageActions.UpdateSelectedTicketStates(ticketStates));
  }

  handleSelectedTicketListModeChanged(event: any): void {
    let inboundFilters: PfDataGridFilter[] = [{
      SourceName: 'User_ID',
      Operator: '=',
      Value: this.userId.toString()
    }];
    if (this.selectedTicketListMode === TicketListMode.AllCompanyTickets) {
      inboundFilters = [{
        SourceName: 'Is_Private',
        Operator: '=',
        Value: '0'
      }];
    }
    this.pfGridStore.dispatch(new fromPfGridActions.UpdateInboundFilters(ServicePageConfig.ServicePageViewId, inboundFilters));
  }
}
