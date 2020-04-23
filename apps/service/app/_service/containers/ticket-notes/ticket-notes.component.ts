import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromServicePageReducer from '../../reducers';
import * as fromTicketNotesActions from '../../actions/ticket-notes.actions';
import { ServicePageConfig, TicketNote } from '../../models';

@Component({
  selector: 'pf-ticket-notes',
  templateUrl: './ticket-notes.component.html',
  styleUrls: ['./ticket-notes.component.scss']
})
export class TicketNotesComponent {
  @Input() ticketId: number;
  @Input() canAddNote: boolean;

  ticketNotes$: Observable<TicketNote[]>;
  quillConfig = ServicePageConfig.quillConfig;
  note: string;

  constructor(
    private store: Store<fromServicePageReducer.State>
  ) {
    this.ticketNotes$ = this.store.select(fromServicePageReducer.getTicketNotes);
  }

  handleAddNoteClicked(): void {
    if (!this.ticketId || !this.note || this.note.length === 0) {
      return;
    }
    this.store.dispatch(new fromTicketNotesActions.AddNote({ ticketId: this.ticketId, note: this.note }));
    this.note = '';
  }
}
