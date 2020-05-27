import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfLinkifyService } from '../../services/pf-linkify-service';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostAddReplyViewReducer from '../../reducers';
import * as fromCommunityAttachmentsReducer from '../../reducers';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';

import { CommunityAddReply, CommunityAttachment, CommunityReply, CommunityAttachmentModalState, CommunityAttachmentUploadStatus } from 'libs/models/community';
import { CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityConstants } from '../../models';
import { AppNotification } from 'libs/features/app-notifications/models';
import { attachmentsReadyForUpload } from '../../helpers/model-mapping.helper';

@Component({
  selector: 'pf-community-post-add-reply',
  templateUrl: './community-post-add-reply.component.html',
  styleUrls: ['./community-post-add-reply.component.scss']
})
export class CommunityPostAddReplyComponent implements OnInit, OnDestroy {
  @Input() postId: string;
  @Input() maximumReplies: number;
  @Input() replyCount: number;
  @Output() replySubmitted = new EventEmitter<boolean>();

  addingCommunityPostReply$: Observable<boolean>;
  addedReplyView$: Observable<CommunityReply[]>;
  addingCommunityPostReplySuccess$: Observable<boolean>;
  addingCommunityPostReplySuccessSubscription: Subscription;
  currentAttachmentModalState$: Observable<CommunityAttachmentModalState>;
  getNotification$: Observable<AppNotification<any>[]>;
  getNotificationSubscription: Subscription;

  communityPostReplyForm: FormGroup;
  replyMaxLength = CommunityConstants.DISCUSSION_MAX_TEXT_LENGTH;
  addedRepliesSubscription: Subscription;
  addedRepliesCount = 0;
  attachmentModalId: string;
  communityAttachments: CommunityAttachment[] = [];
  submitAttempted = false;

  get content() { return this.communityPostReplyForm.get('content'); }
  get attachments() { return this.communityPostReplyForm.get('attachments'); }

  constructor(public store: Store<fromCommunityPostReplyReducer.State>,
              public addReplyViewStore: Store<fromCommunityPostAddReplyViewReducer.State>,
              private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
              private formBuilder: FormBuilder,
              public pfLinkifyService: PfLinkifyService) {
    this.buildForm();

    this.addingCommunityPostReply$ = this.store.select(fromCommunityPostReplyReducer.getAddingCommunityPostReply);
    this.addingCommunityPostReplySuccess$ = this.store.select(fromCommunityPostReplyReducer.getAddingCommunityPostReplySuccess);
    this.addedReplyView$ = this.addReplyViewStore.select(fromCommunityPostAddReplyViewReducer.getFilteredCommunityPostAddReplyView);
    this.currentAttachmentModalState$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalState);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
  }

  buildForm() {
    this.communityPostReplyForm = this.formBuilder.group({
      content:  ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.replyMaxLength)]],
      attachments: []
    });

  }
  ngOnInit()  {
    this.attachmentModalId = `${CommunitySearchResultTypeEnum.Reply}_${this.postId}`;
    this.addingCommunityPostReplySuccessSubscription = this.addingCommunityPostReplySuccess$.subscribe((response) => {
        if (response) {
          this.communityPostReplyForm.reset();
          this.submitAttempted = false;
        }
    });
    this.addedRepliesSubscription = this.addedReplyView$.subscribe(results => {
      this.addedRepliesCount = results.filter(x => x.PostId === this.postId).length;
    });

    this.currentAttachmentModalState$.subscribe((state) => {
      if (state && state.Id === this.attachmentModalId) {
        this.communityAttachments = state.Attachments;
    }});

    this.getNotificationSubscription = this.getNotification$.subscribe(notifications => {
      notifications.forEach(notification => {
        if (!notification) {
          return;
        }
        const attachment = this.communityAttachments.find((x) => x.Id === notification.NotificationId);
        if (attachment && notification.Level === 'Success') {
          this.store.dispatch(new fromCommunityAttachmentActions.AttachmentScanSuccess(this.attachmentModalId, attachment.Id));
          return;
        } else if (attachment) {
          this.store.dispatch(new fromCommunityAttachmentActions.AttachmentScanFailure(this.attachmentModalId, attachment.Id));
          return;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.addingCommunityPostReplySuccessSubscription) {
      this.addingCommunityPostReplySuccessSubscription.unsubscribe();
    }

    if (this.addedRepliesSubscription) {
      this.addedRepliesSubscription.unsubscribe();
    }

    this.getNotificationSubscription.unsubscribe();
  }

  submitReply() {
    this.content.markAsDirty();
    this.submitAttempted = true;

    this.attachments.setValue(this.communityAttachments);
    if (!attachmentsReadyForUpload(this.communityAttachments)) {
      this.attachments.setErrors({'scanInProgress': true});
    }

    if (this.communityPostReplyForm.valid) {
      const newReply: CommunityAddReply = {
        PostId: this.postId,
        ReplyText: this.content.value,
        Links: this.pfLinkifyService.getLinks(this.content.value),
        Attachments:  this.communityAttachments.filter((x) => x.Status === CommunityAttachmentUploadStatus.ScanSucceeded)
      };
      this.store.dispatch(new fromCommunityPostReplyActions.AddingCommunityPostReply(newReply));
      this.replySubmitted.emit();
    }
  }

  openAttachmentsModal() {
    this.store.dispatch(new fromCommunityAttachmentActions.OpenCommunityAttachmentsModal(this.attachmentModalId));
  }

  get scanningAttachments() {
    return this.communityAttachments.find((x) => x.Status === CommunityAttachmentUploadStatus.ScanInProgress);
  }

  get scannedAttachmentsCount() {
    return this.communityAttachments.filter((x) => x.Status === CommunityAttachmentUploadStatus.ScanSucceeded).length;
  }
}
