import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Comment } from 'libs/features/comment-box/models';

import * as fromServicePageReducer from '../../reducers';
import * as fromTicketNotesActions from '../../actions/ticket-notes.actions';
import { ServicePageConfig } from '../../models';

@Component({
  selector: 'pf-ticket-notes',
  templateUrl: './ticket-notes.component.html',
  styleUrls: ['./ticket-notes.component.scss']
})
export class TicketNotesComponent {
  @Input() ticketId: number;
  @Input() canAddNote: boolean;

  ticketNotes$: Observable<Comment[]>;
  quillConfig = ServicePageConfig.quillConfig;
  content = '';
  note: string;

  constructor(
    private store: Store<fromServicePageReducer.State>
  ) {
    this.ticketNotes$ = this.store.select(fromServicePageReducer.getTicketNotes);
  }

  handleAddNoteClicked(): void {
    if (!this.ticketId || !this.note || this.note.length === 0 || !this.content.length) {
      return;
    }
    this.store.dispatch(new fromTicketNotesActions.AddNote({ ticketId: this.ticketId, note: this.note }));
    this.note = '';
  }

  handleReply(note: Comment, content: string): void {
    if (!this.canAddNote || !note || !content) {
      return;
    }
    this.store.dispatch(new fromTicketNotesActions.ReplyNote({
      ticketId: this.ticketId,
      commentId: note.CommentId,
      content
    }));
  }

  updateContent(event: any) {
    this.content = event.text.trim();
  }
}
