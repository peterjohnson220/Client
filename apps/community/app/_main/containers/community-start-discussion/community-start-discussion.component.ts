import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { CommunityPost, CommunityAddPost } from 'libs/models/community';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  communityDiscussionForm: FormGroup;
  UserAvatarSource = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReducer.State>,
              private formBuilder: FormBuilder) {
    this.buildForm();

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
  }

  ngOnInit() {

    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
        this.communityDiscussionForm.reset();
      }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      postText:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
      isInternalOnly:  [false]
    });
  }

  submitPost() {
    if (this.communityDiscussionForm.valid) {
      const newPost: CommunityAddPost = {
        PostText: this.communityDiscussionForm.controls['postText'].value,
        IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value
      };
      this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));
    }
  }
}
