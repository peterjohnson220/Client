import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromServicePageActions from '../../actions/service-page.actions';
import * as fromServicePageReducer from '../../reducers';
import { MultiSelectItemGroup } from '../../models';

@Component({
  selector: 'pf-service-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent {
  ticketStates$: Observable<AsyncStateObj<MultiSelectItemGroup[]>>;
  selectedTicketStates$: Observable<string[]>;

  constructor(private store: Store<fromServicePageReducer.State>) {
    this.ticketStates$ = this.store.select(fromServicePageReducer.getTicketStates);
    this.selectedTicketStates$ = this.store.select(fromServicePageReducer.getSelectedTicketStates);
  }

  handleSelectedStatesChanged(ticketStates: MultiSelectItemGroup[]): void {
    this.store.dispatch(new fromServicePageActions.UpdateSelectedTicketStates(ticketStates));
  }
}
