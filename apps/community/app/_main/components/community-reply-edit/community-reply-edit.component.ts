import { Component, OnInit, Input } from '@angular/core';
import { CommunityAttachment, CommunityUpdateReply, CommunityReply } from 'libs/models';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

@Component({
  selector: 'pf-community-reply-edit',
  templateUrl: './community-reply-edit.component.html',
  styleUrls: ['./community-reply-edit.component.scss']
})
export class CommunityReplyEditComponent implements OnInit {

  @Input() reply: CommunityReply;
  communityAttachments: CommunityAttachment[];

  constructor(public store: Store<fromCommunityPostReplyReducer.State>) { }

  ngOnInit() {
    this.communityAttachments = this.reply.Attachments;
  }

  savePost() {
      const updatedReply: CommunityUpdateReply = {
        ReplyId: this.reply.Id,
        PostId: this.reply.PostId,
        ReplyText: this.reply.ReplyText,
        Attachments: this.communityAttachments
      };

      this.store.dispatch(new fromCommunityPostReplyActions.SavingCommunityPostReplyEdit(updatedReply));
  }

  cancelEdit() {
    this.store.dispatch(new fromCommunityPostReplyActions.CancelEditingCommunityPostReply);
  }

  onAttachmentRemoved(fileName: string) {
    this.communityAttachments = this.communityAttachments.filter(x => x.CloudFileName !== fileName);
  }
}
