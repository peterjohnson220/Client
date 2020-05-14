import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityJobReducer from '../../reducers';
import * as fromCommunityAttachmentsReducer from '../../reducers';

import { CommunityPostTypeStatusEnum } from 'libs/models/community/community-constants.model';
import { CommunityNewPostComponent } from '../community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from '../community-new-poll/community-new-poll.component';
import { CommunityNewJobComponent } from '../community-new-job/community-new-job.component';
import { CommunityJob } from 'libs/models';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  postType = CommunityPostTypeStatusEnum.Discussion;

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityJobSuccess$: Observable<CommunityJob>;
  communityPostAttachmentsCount$: Observable<number>;

  submittingCommunityJobSuccessSubscription: Subscription;
  showPostJobButton = true;

  creatingUserPoll$: Observable<boolean>;

  get CommunityPostTypes() { return CommunityPostTypeStatusEnum; }

  @ViewChild('newPostComponent', { static: false }) newPostComponent: CommunityNewPostComponent;
  @ViewChild('newPollComponent', { static: false }) newPollComponent: CommunityNewPollComponent;
  @ViewChild('newJobComponent', { static: false }) newJobComponent: CommunityNewJobComponent;

  constructor(private store: Store<fromCommunityPostReducer.State>,
    private route: ActivatedRoute) {

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityJobSuccess$ = this.store.select(fromCommunityJobReducer.getSubmittingCommunityJobsSuccess);
    this.communityPostAttachmentsCount$ = this.store.select(fromCommunityAttachmentsReducer.getCommunityAttachmentsCount);
  }

  ngOnInit() {
    this.submittingCommunityJobSuccessSubscription = this.submittingCommunityJobSuccess$.subscribe((response) => {
      this.showPostJobButton = response ? false : true;
    });

    this.route.queryParams.subscribe(params => {
      if ( params['type'] === 'poll') {this.postType = CommunityPostTypeStatusEnum.Question; }
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

  get submitEnabled() {
    if ( this.newPostComponent ) {
      return this.newPostComponent.isFormValid;
    } else if ( this.newPollComponent) {
      return this.newPollComponent.isFormValid;
    } else if ( this.newJobComponent) {
      return this.newJobComponent.isFormValid;
    } else { return false; }
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
      this.newPostComponent.submit();
    } else if ( this.postType === this.CommunityPostTypes.Question && this.newPollComponent) {
      this.newPollComponent.submit();
    } else if ( this.postType === this.CommunityPostTypes.Job && this.newJobComponent) {
      this.newJobComponent.submit();
    }
  }

  openAttachmentsModal() {
    this.store.dispatch(new fromCommunityAttachmentActions.OpenCommunityAttachmentsModal());
  }
}
