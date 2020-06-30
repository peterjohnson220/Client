import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { AsyncStateObj } from 'libs/models/state';
import { UserContext } from 'libs/models/security';

import * as fromServicePageReducer from '../../reducers';
import * as fromServicePageActions from '../../actions/service-page.actions';
import * as fromTicketNotesActions from '../../actions/ticket-notes.actions';
import { UserTicket, NoteAccessLevel } from '../../models';

@Component({
  selector: 'pf-tickets-details',
  templateUrl: './tickets-details.component.html',
  styleUrls: ['./tickets-details.component.scss']
})
export class TicketsDetailsComponent implements OnChanges, OnDestroy {
  @Input() userId: number;
  @Input() jobDetailsFilters: PfDataGridFilter[];
  @Input() selectedTicketId: number;
  @Output() onClose = new EventEmitter();
  @Output() togglePublicOrPrivateSwitch = new EventEmitter<{value: boolean, ticketId: number}>();

  ticket$: Observable<AsyncStateObj<UserTicket>>;

  ticketSubscription: Subscription;
  ticket: UserTicket;
  noteAccessLevel = NoteAccessLevel;

  constructor(
    private store: Store<fromServicePageReducer.State>,
    ) {
    this.ticket$ = this.store.pipe(select(fromServicePageReducer.getSelectedTicketDetails));
    this.ticketSubscription = this.ticket$.subscribe((t) => {
      if (t.obj && t.obj.TicketId === this.selectedTicketId) {
        this.ticket = t.obj;
        this.store.dispatch(new fromTicketNotesActions.SetTicketNotes(this.ticket.Notes));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedTicketId && (changes.selectedTicketId.previousValue !== changes.selectedTicketId.currentValue)) {
      this.store.dispatch(new fromServicePageActions.GetUserTicket({ userId: this.userId, ticketId: this.selectedTicketId }));
    }
  }

  ngOnDestroy() {
    this.ticketSubscription.unsubscribe();
  }

  close() {
    this.store.dispatch(new fromTicketNotesActions.SetTicketNotes([]));
    this.onClose.emit(null);
  }

  handlePublicOrPrivateToggleSwitch(value: boolean, ticketId: number) {
    this.togglePublicOrPrivateSwitch.emit({value: value, ticketId: ticketId});
  }
}
