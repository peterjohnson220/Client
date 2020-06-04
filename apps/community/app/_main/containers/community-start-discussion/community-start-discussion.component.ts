import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityAttachmentsReducer from '../../reducers';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import { CommunityPostTypeStatusEnum, CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityNewPostComponent } from '../community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from '../community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from '../community-new-job/community-new-job.component';
import { CommunityJob, CommunityAttachmentModalState, CommunityAttachment, CommunityPost, CommunityAttachmentUploadStatus } from 'libs/models';
import { AppNotification } from 'libs/features/app-notifications/models';

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

  get CommunityPostTypes() { return CommunityPostTypeStatusEnum; }

  @ViewChild('newPostComponent') newPostComponent: CommunityNewPostComponent;
  @ViewChild('newPollComponent') newPollComponent: CommunityNewPollComponent;
  @ViewChild('newJobComponent') newJobComponent: CommunityNewJobComponent;

  constructor(private store: Store<fromCommunityPostReducer.State>,
    private route: ActivatedRoute,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>) {

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityJobSuccess$ = this.store.select(fromCommunityJobReducer.getSubmittingCommunityJobsSuccess);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
    this.addingCommunityDiscussionPollSuccess$ = this.store.select(fromCommunityPostReducer.getAddingCommunityDiscussionPollSuccess);
    this.currentAttachmentModalState$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalState);
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

  openAttachmentsModal() {
    this.store.dispatch(new fromCommunityAttachmentActions.OpenCommunityAttachmentsModal(this.attachmentModalId));
  }

  get scannedAttachmentsCount() {
    return this.communityAttachments.filter((x) => x.Status === CommunityAttachmentUploadStatus.ScanSucceeded).length;
  }

  get scanningAttachments() {
    return this.communityAttachments.find((x) => x.Status === CommunityAttachmentUploadStatus.ScanInProgress);
  }

}
