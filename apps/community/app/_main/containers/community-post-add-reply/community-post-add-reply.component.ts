import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { CommunityAddReply, CommunityPost } from 'libs/models/community';

@Component({
  selector: 'pf-community-post-add-reply',
  templateUrl: './community-post-add-reply.component.html',
  styleUrls: ['./community-post-add-reply.component.scss']
})
export class CommunityPostAddReplyComponent implements OnInit, OnDestroy {
  @Input() postId: string;
  communityPostReplyForm: FormGroup;
  replyMaxLength = 2000;
  addingCommunityPostReply$: Observable<boolean>;
  addingCommunityPostReplySuccess$: Observable<boolean>;
  addingCommunityPostReplySuccessSubscription: Subscription;

  constructor(public store: Store<fromCommunityPostReducer.State>,
              private formBuilder: FormBuilder) {
    this.buildForm();

    this.addingCommunityPostReply$ = this.store.select(fromCommunityPostReducer.getAddingCommunityPostReply);
    this.addingCommunityPostReplySuccess$ = this.store.select(fromCommunityPostReducer.getAddingCommunityPostReplySuccess);
  }

  buildForm() {
    this.communityPostReplyForm = this.formBuilder.group({
      replyText:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.replyMaxLength)]]
    });
  }
  ngOnInit()  {
    this.addingCommunityPostReplySuccessSubscription = this.addingCommunityPostReplySuccess$.subscribe((response) => {
        if (response) {
          this.communityPostReplyForm.reset();
        }
    });
  }

  ngOnDestroy() {
    this.addingCommunityPostReplySuccessSubscription.unsubscribe();
  }

  submitReply() {
    if (this.communityPostReplyForm.valid) {
      const newReply: CommunityAddReply = {
        PostId: this.postId,
        ReplyText: this.communityPostReplyForm.controls['replyText'].value
      };
      this.store.dispatch(new fromCommunityPostActions.AddingCommunityPostReply(newReply));
    }
  }
}
