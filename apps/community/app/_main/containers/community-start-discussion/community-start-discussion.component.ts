import { Component, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import { CommunityPostTypeStatusEnum } from 'libs/models/community/community-constants.model';
import { CommunityNewPostComponent } from '../community-new-post/community-new-post.component';
import { CommunityNewPollComponent } from '../community-new-poll/community-new-poll.component';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent {
  UserAvatarSource = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
  postType = CommunityPostTypeStatusEnum.Discussion;

  submittingCommunityPost$: Observable<boolean>;

  get CommunityPostTypes() { return CommunityPostTypeStatusEnum; }

  @ViewChild('newPostComponent') newPostComponent: CommunityNewPostComponent;
  @ViewChild('newPollComponent') newPollComponent: CommunityNewPollComponent;

  constructor(public store: Store<fromCommunityPostReducer.State>) {
    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
  }

  onPostTypeClick(postType) {
      this.postType = postType;
  }

  submitContent() {
    if ( this.postType === this.CommunityPostTypes.Discussion ) {
      this.newPostComponent.submit();
    } else if ( this.postType === this.CommunityPostTypes.Question ) {
      this.newPollComponent.submit();
    }
  }

}
