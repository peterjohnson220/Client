import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityAttachmentsReducer from '../../reducers';

import { CommunityPostTypeStatusEnum, CommunitySearchResultTypeEnum } from 'libs/models/community/community-constants.model';
import { CommunityNewPostComponent } from '../community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from '../community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from '../community-new-job/community-new-job.component';
import { CommunityJob, CommunityAttachmentModalState, CommunityAttachment } from 'libs/models';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  postType = CommunityPostTypeStatusEnum.Discussion;

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityJobSuccess$: Observable<CommunityJob>;
  currentAttachmentModalState$: Observable<CommunityAttachmentModalState>;
  creatingUserPoll$: Observable<boolean>;

  submittingCommunityJobSuccessSubscription: Subscription;
  showPostJobButton = true;
  attachmentModalId: string;
  communityPostAttachments: CommunityAttachment[];

  get CommunityPostTypes() { return CommunityPostTypeStatusEnum; }

  @ViewChild('newPostComponent', { static: false }) newPostComponent: CommunityNewPostComponent;
  @ViewChild('newPollComponent', { static: false }) newPollComponent: CommunityNewPollComponent;
  @ViewChild('newJobComponent', { static: false }) newJobComponent: CommunityNewJobComponent;

  constructor(private store: Store<fromCommunityPostReducer.State>,
    private route: ActivatedRoute) {

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityJobSuccess$ = this.store.select(fromCommunityJobReducer.getSubmittingCommunityJobsSuccess);
    this.currentAttachmentModalState$ = this.store.select(fromCommunityAttachmentsReducer.getCurrentAttachmentModalState);
  }

  ngOnInit() {
    this.attachmentModalId = CommunitySearchResultTypeEnum.Discussion;
    this.submittingCommunityJobSuccessSubscription = this.submittingCommunityJobSuccess$.subscribe((response) => {
      this.showPostJobButton = response ? false : true;
    });

    this.route.queryParams.subscribe(params => {
      if ( params['type'] === 'poll') {this.postType = CommunityPostTypeStatusEnum.Question; }
  });

  this.currentAttachmentModalState$.subscribe((state) => {
    if (state && state.Id === this.attachmentModalId) {
        this.communityPostAttachments = state.Attachments;
    }
  });
  }

  ngOnDestroy() {
    if (this.submittingCommunityJobSuccessSubscription) {
      this.submittingCommunityJobSuccessSubscription.unsubscribe();
    }
  }

  onPostTypeClick(postType) {
      this.postType = postType;
  }

  get submitVisible() {
    if ( this.postType === this.CommunityPostTypes.Discussion || this.postType === this.CommunityPostTypes.Question) {
      return true;
    } else if ( this.postType === this.CommunityPostTypes.Job) {
      return this.showPostJobButton;
    }
  }

  submitContent() {
    if ( this.postType === this.CommunityPostTypes.Discussion &&  this.newPostComponent ) {
      this.newPostComponent.submit(this.communityPostAttachments);
    } else if ( this.postType === this.CommunityPostTypes.Question && this.newPollComponent) {
      this.newPollComponent.submit();
    } else if ( this.postType === this.CommunityPostTypes.Job && this.newJobComponent) {
      this.newJobComponent.submit();
    }
  }

  openAttachmentsModal() {
    this.store.dispatch(new fromCommunityAttachmentActions.OpenCommunityAttachmentsModal(this.attachmentModalId));
  }
}
