import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PfLinkifyService } from '../../services/pf-linkify-service';

import { CommunityAddPost, CommunityPost, CommunityTopic, CommunityAttachment, CommunityAttachmentUploadStatus } from 'libs/models';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import { CommunityConstants } from '../../models';
import { attachmentsReadyForUpload } from '../../helpers/model-mapping.helper';

@Component({
  selector: 'pf-community-new-post',
  templateUrl: './community-new-post.component.html',
  styleUrls: ['./community-new-post.component.scss']
})
export class CommunityNewPostComponent implements OnInit, OnDestroy {
  submittingCommunityPostSuccess$: Observable<CommunityPost>;
  submittingCommunityPostSuccessSubscription: Subscription;

  communityDiscussionForm: FormGroup;
  textMaxLength = CommunityConstants.DISCUSSION_MAX_TEXT_LENGTH;

  communityTopics$: Observable<CommunityTopic[]>;
  selectedTopicId: string;
  communityTopics: CommunityTopic[];

  get content() { return this.communityDiscussionForm.get('content'); }
  get topic() { return this.communityDiscussionForm.get('topic'); }
  get attachments() { return this.communityDiscussionForm.get('attachments'); }
  get isFormValid() { return this.communityDiscussionForm.valid; }

  constructor(public store: Store<fromCommunityPostReducer.State>,
    private formBuilder: FormBuilder,
    public pfLinkifyService: PfLinkifyService) {
      this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
      this.communityTopics$ = this.store.select(fromCommunityPostReducer.getTopics);
      this.buildForm();
    }

  ngOnInit() {
    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
          this.communityDiscussionForm.reset({ value: 'formState', isInternalOnly: false});
      }
    });

    this.communityTopics$.subscribe ((response) => {
      this.communityTopics = [];
      if (response && response.length > 0) {
        this.communityTopics = response;
      }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      'content':   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.textMaxLength)]],
      'isInternalOnly':  [false],
      'topic': [null, [ Validators.required ]],
      'attachments': []
    });

  }

  submit(attachments: CommunityAttachment[]) {

    this.attachments.setValue(attachments);
    if (!attachmentsReadyForUpload(attachments)) {
      this.attachments.setErrors({'scanInProgress': true});
    }
    this.communityDiscussionForm.markAllAsTouched();
    this.content.markAsDirty();

    if (!this.communityDiscussionForm.valid) {
      return;
    }

    const newPost: CommunityAddPost = {
      PostText: this.content.value,
      IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value,
      Links: this.pfLinkifyService.getLinks(this.content.value),
      TopicId: this.topic.value,
      Attachments: attachments.filter((x) => x.Status === CommunityAttachmentUploadStatus.ScanSucceeded)
    };

    this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));
  }
}
