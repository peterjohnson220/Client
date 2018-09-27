import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CommunityAddPost, CommunityPost } from 'libs/models';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';


@Component({
  selector: 'pf-community-new-post',
  templateUrl: './community-new-post.component.html',
  styleUrls: ['./community-new-post.component.scss']
})
export class CommunityNewPostComponent implements OnInit, OnDestroy {

  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;

  communityDiscussionForm: FormGroup;

  textMaxLength = 2000;

  get context() { return this.communityDiscussionForm.get('context'); }
  get isFormValid() { return this.communityDiscussionForm.valid; }

  constructor(public store: Store<fromCommunityPostReducer.State>,
    private formBuilder: FormBuilder) {
      this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
      this.buildForm();
    }

  ngOnInit() {
    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
          this.communityDiscussionForm.reset({ value: 'formState', isInternalOnly: false});
      }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      'context':   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.textMaxLength)]],
      'isInternalOnly':  [false]
    });
  }

  submit() {
    if (!this.communityDiscussionForm.valid) {
      return;
    }
    const newPost: CommunityAddPost = {
      PostText: this.context.value,
      IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value
    };
    this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));
  }

}
