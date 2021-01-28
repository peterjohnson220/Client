import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { CloudFileLocations } from 'libs/constants';
import { CommunityAttachment, CommunityUpdateReply, CommunityReply, UserContext } from 'libs/models';
import * as fromRootReducer from 'libs/state/state';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import { CommunityConstants } from '../../models';

@Component({
  selector: 'pf-community-reply-edit',
  templateUrl: './community-reply-edit.component.html',
  styleUrls: ['./community-reply-edit.component.scss']
})
export class CommunityReplyEditComponent implements OnInit, OnDestroy {

  @Input() reply: CommunityReply;
  communityAttachments: CommunityAttachment[];
  communityReplyEditForm: FormGroup;

  userContext$: Observable<UserContext>;
  userContextSub: Subscription;

  editMaxLength =  CommunityConstants.DISCUSSION_MAX_TEXT_LENGTH;
  avatarUrl: string;
  companyLogoUrl: string;

  get content() { return this.communityReplyEditForm.get('content'); }
  get isFormValid() { return this.communityReplyEditForm.valid; }

  constructor(public store: Store<fromCommunityPostReplyReducer.State>, private formBuilder: FormBuilder) {

    this.communityReplyEditForm = this.formBuilder.group({
      content:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.editMaxLength)]]
    });
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit() {
    this.communityAttachments = this.reply.Attachments;
    this.userContextSub = this.userContext$.subscribe((userContext) => {
      this.avatarUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.UserAvatars;
      this.companyLogoUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.CompanyLogos;
    });
    setTimeout(() => {
      this.content.setValue(this.reply.ReplyText);
    });
  }

  ngOnDestroy() {
    this.userContextSub.unsubscribe();
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
