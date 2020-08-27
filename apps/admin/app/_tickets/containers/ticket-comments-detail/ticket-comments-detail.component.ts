import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import cloneDeep from 'lodash/cloneDeep';

import { TicketCommentLevel } from 'libs/models/payfactors-api/service/response';
import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';

import * as fromTicketAdminReducer from '../../reducers';
import * as fromTicketActions from '../../actions/ticket.actions';
import { TicketComment } from '../../models';

@Component({
  selector: 'pf-ticket-comments-detail',
  templateUrl: './ticket-comments-detail.component.html',
  styleUrls: ['./ticket-comments-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketCommentsDetailComponent implements OnChanges {
  @Input() comments: TicketComment[];
  @Input() ticketId: number;

  _comments: TicketComment[];
  commentLevel = TicketCommentLevel;

  constructor(private store: Store<fromTicketAdminReducer.State>) {
  }

  ngOnChanges() {
    this._comments = this.comments;
  }

  addNewComment() {
    const commentsCopy = cloneDeep(this._comments);
    if(commentsCopy.length > 0){
      const firstComment = commentsCopy[0]
      if (firstComment.Content == '' && firstComment.Level == TicketCommentLevel.Admin) {
        commentsCopy.shift()
      }
    }
    const ticketId = this.ticketId;
    const comment: TicketComment = {
      TicketId: ticketId,
      Content: '',
      Level: TicketCommentLevel.Admin
    };
    commentsCopy.unshift(comment);
    this._comments = commentsCopy;
  }

  removeComment(comment: TicketComment) {
    if (comment.CommentId) {
      const request: UserTicketCommentRequest = {
        UserTicketId: comment.TicketId,
        UserTicketsCommentId: comment.CommentId
      };
      this.store.dispatch(new fromTicketActions.DeleteComment(request));
    } else {

      const index = this._comments.indexOf(comment);
      this._comments.splice(index, 1);
    }
  }

  upsertComment(comment: UserTicketCommentRequest) {
    if (comment.UserTicketsCommentId) {
      this.store.dispatch(new fromTicketActions.UpdateComment(comment));
    } else {
      this.store.dispatch(new fromTicketActions.CreateComment(comment));
    }
  }

  handleReply(content: string, comment: TicketComment): void {
    this.store.dispatch(new fromTicketActions.ReplyClientNote({ comment, content }));
  }
}
