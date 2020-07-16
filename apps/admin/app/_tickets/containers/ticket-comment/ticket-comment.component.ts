import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';
import { TicketCommentLevel } from 'libs/models/payfactors-api/service/response';

import { TicketComment } from '../../models';

@Component({
  selector: 'pf-ticket-comment',
  templateUrl: './ticket-comment.component.html',
  styleUrls: ['./ticket-comment.component.scss']
})
export class TicketCommentComponent implements OnInit {
  @Input() comment: TicketComment;
  @Output() removeCommentEvent = new EventEmitter();
  @Output() saveCommentEvent = new EventEmitter();

  editMode: boolean;
  commentText = '';
  commentLevel = TicketCommentLevel;

  constructor() { }

  ngOnInit() {
    this.commentText = this.comment.Content;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  updateText(event: any) {
    this.commentText = event.target.value;
    const textarea = event.target;
    const scrollHeight = (textarea.scrollHeight + 2) + 'px';
    textarea.style.height = 'auto';
    textarea.style.overflow = 'auto';
    if (textarea.value === '') {
      textarea.style.height = textarea.style.minHeight;
    } else {
      textarea.style.height = scrollHeight;
    }
  }

  removeComment(comment: any) {
    this.removeCommentEvent.emit(comment);
  }

  saveComment(comment: TicketComment) {
    if (this.commentText === '' || comment.Content === this.commentText) {
      return;
    } else {
      const request: UserTicketCommentRequest = {
        UserTicketId: comment.TicketId,
        UserTicketsCommentId: comment.CommentId,
        Comments: this.commentText
      };
      this.saveCommentEvent.emit(request);
      this.editMode = false;
    }
  }
}
