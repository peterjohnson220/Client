import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as constants from 'libs/models/community/community-constants.model';
import { CommunityPost, CommunityAddPost } from 'libs/models/community';

@Component({
  selector: 'pf-community-start-discussion',
  templateUrl: './community-start-discussion.component.html',
  styleUrls: ['./community-start-discussion.component.scss']
})
export class CommunityStartDiscussionComponent implements OnInit, OnDestroy {
  communityDiscussionForm: FormGroup;
  UserAvatarSource = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';
  postMaxLength = 2000;

  submittingCommunityPost$: Observable<boolean>;
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;

  @ViewChild('discussionTextArea') discussionTextArea: ElementRef;
  @ViewChild('overlayTextArea') overlayTextArea: ElementRef;
  @ViewChild('textAreaContainer') textAreaContainer: ElementRef;

  constructor(public store: Store<fromCommunityPostReducer.State>,
              private formBuilder: FormBuilder) {
    this.buildForm();

    this.submittingCommunityPost$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPosts);
    this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
  }

  ngOnInit() {

    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
        this.communityDiscussionForm.reset({ value: 'formState', isInternalOnly: false });

        while (  this.overlayTextArea.nativeElement.firstChild) {
          this.overlayTextArea.nativeElement.removeChild(  this.overlayTextArea.nativeElement.firstChild);
        }
      }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      postText:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.postMaxLength)]],
      isInternalOnly:  [false]
    });
  }

  submitPost() {
    if (this.communityDiscussionForm.valid) {
      const newPost: CommunityAddPost = {
        // TODO: HashTags: this.discussionTextArea.nativeElement.value.match(constants.HashTagRegEx),
        PostText: this.communityDiscussionForm.controls['postText'].value,
        IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value
      };
      this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));
    }
  }

  onKeyDown(e) {
    this.autogrow();
  }

  onKeyUp(e) {
    this.autogrow();
  }

  private autogrow() {
    if (this.discussionTextArea.nativeElement.scrollHeight >= 50) {
      this.textAreaContainer.nativeElement.style.height = this.discussionTextArea.nativeElement.scrollHeight + 'px';
    }
  }

}
