import { ChangeDetectionStrategy, Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { cloneDeep } from 'lodash';

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

  constructor(private store: Store<fromTicketAdminReducer.State>) {
  }

  ngOnChanges() {
    this._comments = this.comments;
  }

  addNewComment() {
    const commentsCopy = cloneDeep(this._comments);
    const ticketId = this.ticketId;
    const comment: TicketComment = {
      TicketId: ticketId,
      Comments: '',
    };
    commentsCopy.unshift(comment);
    this._comments = commentsCopy;
  }

  removeComment(comment: TicketComment) {
    if (comment.UserTicketsCommentsId) {
      const request: UserTicketCommentRequest = {
        UserTicketId: comment.TicketId,
        UserTicketsCommentId: comment.UserTicketsCommentsId
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
}
