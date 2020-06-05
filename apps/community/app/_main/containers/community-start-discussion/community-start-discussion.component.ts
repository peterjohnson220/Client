import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import * as fromCommunityReducer from '../../reducers';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import { CommunityPostTypeStatusEnum, CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityNewPostComponent } from '../community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from '../community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from '../community-new-job/community-new-job.component';
import { CommunityJob, CommunityAttachmentModalState, CommunityAttachment, CommunityPost, CommunityAttachmentUploadStatus } from 'libs/models';
import { AppNotification } from 'libs/features/app-notifications/models';
import { CommunityConstants } from '../../models';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  @Input() disableCommunityAttachments: boolean;

  postType = CommunityPostTypeStatusEnum.Discussion;

  attachmentModalId: string;
  communityAttachments: CommunityAttachment[]  = [];
  submitAttempted = false;
  newPostHasData = false;

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityJobSuccess$: Observable<CommunityJob>;
  submittingCommunityJobSuccessSubscription: Subscription;
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;
  addingCommunityDiscussionPollSuccess$: Observable<boolean>;
  addingCommunityDiscussionPollSuccessSubscription: Subscription;
  currentAttachmentModalState$: Observable<CommunityAttachmentModalState>;
  currentAttachmentModalStateSubscription: Subscription;
  getNotification$: Observable<AppNotification<any>[]>;
  getNotificationSubscription: Subscription;
  discardingPostProceed$: Observable<boolean>;
  discardingPostProceedSubscription: Subscription;

  get CommunityPostTypes() { return CommunityPostTypeStatusEnum; }

  @ViewChild('newPostComponent') newPostComponent: CommunityNewPostComponent;
  @ViewChild('newPollComponent') newPollComponent: CommunityNewPollComponent;
  @ViewChild('newJobComponent') newJobComponent: CommunityNewJobComponent;

  constructor(private store: Store<fromCommunityReducer.State>,
    private route: ActivatedRoute,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>) {

    this.submittingCommunityPost$ = this.store.select(fromCommunityReducer.getSubmittingCommunityPosts);
    this.submittingCommunityJobSuccess$ = this.store.select(fromCommunityReducer.getSubmittingCommunityJobsSuccess);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityReducer.getSubmittingCommunityPostsSuccess);
    this.addingCommunityDiscussionPollSuccess$ = this.store.select(fromCommunityReducer.getAddingCommunityDiscussionPollSuccess);
    this.currentAttachmentModalState$ = this.store.select(fromCommunityReducer.getCurrentAttachmentModalState);
    this.discardingPostProceed$ = this.store.select(fromCommunityReducer.getDiscardingPostProceed);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
  }

  ngOnInit() {
    this.attachmentModalId = CommunitySearchResultTypeEnum.Discussion;
    this.submittingCommunityJobSuccessSubscription = this.submittingCommunityJobSuccess$.subscribe((response) => {
      if (response) {
        this.submitAttempted = false;
      }
    });

    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
        this.submitAttempted = false;
      }
    });

    this.addingCommunityDiscussionPollSuccessSubscription = this.addingCommunityDiscussionPollSuccess$.subscribe((response) => {
      if (response) {
        this.submitAttempted = false;
      }
    });

    this.route.queryParams.subscribe(params => {
      if ( params['type'] === 'poll') {this.postType = CommunityPostTypeStatusEnum.Question; }
    });

    this.currentAttachmentModalStateSubscription = this.currentAttachmentModalState$.subscribe((state) => {
      if (state && state.Id === this.attachmentModalId) {
          this.communityAttachments = state.Attachments;
      }});

    this.discardingPostProceedSubscription = this.discardingPostProceed$.subscribe(result => {
    if (result) {
      this.newPostComponent?.resetForm();

      this.communityAttachments?.forEach(attachment => {
        const attachmentNames = [];
        this.communityAttachments.forEach(element => {
          attachmentNames.push(element.CloudFileName);
        });
        this.store.dispatch(new fromCommunityAttachmentActions.DiscardAttachments(attachmentNames));
        this.store.dispatch(new fromCommunityAttachmentActions.ClearCommunityAttachmentsState(this.attachmentModalId));
      });
    }});

    this.getNotificationSubscription = this.getNotification$.subscribe(notifications => {
      notifications.forEach(notification => {
        if (!notification) {
          return;
        }

        const attachment = this.communityAttachments.find((x) => x.Id === notification.NotificationId);
        if (!attachment) {
           return;
        }
        if (notification.Level === 'Success' && attachment.Status !== CommunityAttachmentUploadStatus.ScanSucceeded) {
          this.store.dispatch(new fromCommunityAttachmentActions.AttachmentScanSuccess(this.attachmentModalId, attachment.Id));
          this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
        } else if (notification.Level === 'Error' && attachment.Status !== CommunityAttachmentUploadStatus.ScanFailed) {
          this.store.dispatch(new fromCommunityAttachmentActions.AttachmentScanFailure(this.attachmentModalId, attachment.Id));
          this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
        }
      });
    });
  }

  ngOnDestroy() {
    this.submittingCommunityJobSuccessSubscription.unsubscribe();
    this.submittingCommunityJobSuccessSubscription.unsubscribe();
    this.addingCommunityDiscussionPollSuccessSubscription.unsubscribe();
    this.currentAttachmentModalStateSubscription.unsubscribe();
    this.getNotificationSubscription.unsubscribe();
    this.discardingPostProceedSubscription.unsubscribe();
  }

  onPostTypeClick(postType) {
      this.postType = postType;
  }

  submitContent() {
    if ( this.postType === this.CommunityPostTypes.Discussion && this.newPostComponent) {
      this.newPostComponent.submit(this.communityAttachments);
    } else if ( this.postType === this.CommunityPostTypes.Question && this.newPollComponent) {
      this.newPollComponent.submit();
    } else if ( this.postType === this.CommunityPostTypes.Job && this.newJobComponent) {
      this.newJobComponent.submit();
    }
    this.submitAttempted = true;
  }

  discardPost() {
    this.store.dispatch(new fromCommunityPostActions.DiscardingCommunityPost());
  }

  openAttachmentsModal() {
    this.store.dispatch(new fromCommunityAttachmentActions.OpenCommunityAttachmentsModal(this.attachmentModalId));
  }

  handlePostFormChanged(hasData: boolean) {
    this.newPostHasData = hasData;
  }

  get scannedAttachments() {
    return this.communityAttachments.filter((x) => x.Status === CommunityAttachmentUploadStatus.ScanSucceeded);
  }

  get scanningAttachments() {
    return this.communityAttachments.find((x) => x.Status === CommunityAttachmentUploadStatus.ScanInProgress);
  }

}
