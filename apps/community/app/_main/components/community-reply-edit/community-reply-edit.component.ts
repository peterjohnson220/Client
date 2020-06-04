import { Component, OnInit, Input } from '@angular/core';
import { CommunityAttachment, CommunityUpdateReply, CommunityReply } from 'libs/models';
import { Store } from '@ngrx/store';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommunityConstants } from '../../models';

@Component({
  selector: 'pf-community-reply-edit',
  templateUrl: './community-reply-edit.component.html',
  styleUrls: ['./community-reply-edit.component.scss']
})
export class CommunityReplyEditComponent implements OnInit {

  @Input() reply: CommunityReply;
  communityAttachments: CommunityAttachment[];
  communityReplyEditForm: FormGroup;
  editMaxLength =  CommunityConstants.DISCUSSION_MAX_TEXT_LENGTH;

  get content() { return this.communityReplyEditForm.get('content'); }
  get isFormValid() { return this.communityReplyEditForm.valid; }

  constructor(public store: Store<fromCommunityPostReplyReducer.State>, private formBuilder: FormBuilder) {

    this.communityReplyEditForm = this.formBuilder.group({
      content:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.editMaxLength)]]
    });
  }

  ngOnInit() {
    this.communityAttachments = this.reply.Attachments;

    setTimeout(() => {
      this.content.setValue(this.reply.ReplyText);
    });
  }

  savePost() {
    this.content.markAsDirty();

    if (!this.communityReplyEditForm.valid) {
      return;
    }

    const updatedReply: CommunityUpdateReply = {
        ReplyId: this.reply.Id,
        PostId: this.reply.PostId,
        ReplyText: this.content.value,
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
