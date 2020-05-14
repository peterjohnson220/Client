import * as cloneDeep from 'lodash.clonedeep';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PfLinkifyService } from '../../services/pf-linkify-service';

import { CommunityAddPost, CommunityPost, CommunityTopic } from 'libs/models';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityAttachmentActions from '../../actions/community-attachment.actions';

import { SelectEvent, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { mapFileInfoToCommunityAddAttachment } from '../../helpers/model-mapping.helper';
import { CommunityAttachment } from 'libs/models/community/community-attachment.model';

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

  communityTopics$: Observable<CommunityTopic[]>;
  communityAttachments$: Observable<CommunityAttachment[]>;
  selectedTopicId: string;

  uploadedFiles: CommunityAttachment[] = [];

  public defaultTopic: CommunityTopic = { TopicName: 'Select a Topic to start your discussion...', Id: null };

  get context() { return this.communityDiscussionForm.get('context'); }
  get topic() { return this.communityDiscussionForm.get('topic'); }
  get isFormValid() { return this.communityDiscussionForm.valid; }

  constructor(public store: Store<fromCommunityPostReducer.State>,
    private formBuilder: FormBuilder,
    public pfLinkifyService: PfLinkifyService) {
      this.submittingCommunityPostSuccess$ = this.store.select(fromCommunityPostReducer.getSubmittingCommunityPostsSuccess);
      this.communityTopics$ = this.store.select(fromCommunityPostReducer.getTopics);
      this.communityAttachments$ = this.store.select(fromCommunityPostReducer.getCommunityAttachments);
      this.buildForm();
    }

  ngOnInit() {
    this.submittingCommunityPostSuccessSubscription = this.submittingCommunityPostSuccess$.subscribe((response) => {
      if (response) {
          this.communityDiscussionForm.reset({ value: 'formState', isInternalOnly: false});
      }
    });

    this.communityAttachments$.subscribe((response) => {
      if (response) {
        this.uploadedFiles = cloneDeep(response);
      }
    });
  }

  ngOnDestroy() {
    this.submittingCommunityPostSuccessSubscription.unsubscribe();
  }

  buildForm() {
    this.communityDiscussionForm = this.formBuilder.group({
      'context':   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.textMaxLength)]],
      'isInternalOnly':  [false],
      'topic': [null, [ Validators.required ]]
    });

  }

  submit() {
    if (!this.communityDiscussionForm.valid) {
      return;
    }

    const newPost: CommunityAddPost = {
      PostText: this.context.value,
      IsInternalOnly: this.communityDiscussionForm.controls['isInternalOnly'].value,
      Links: this.pfLinkifyService.getLinks(this.context.value),
      TopicId: this.topic.value,
      Attachments: this.uploadedFiles
    };

    this.store.dispatch(new fromCommunityPostActions.SubmittingCommunityPost(newPost));

    this.defaultTopic = { TopicName: 'Select a Topic to start your discussion...', Id: null };
  }

  public onOpenTopicsList(): void {
    this.defaultTopic = null;
  }

  uploadAttachmentEventHandler(e: UploadEvent) {
    // this method is called one file at a time
    const file = e.files[0];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = {CloudFileName: cloudFileName};
    this.uploadedFiles.push(mapFileInfoToCommunityAddAttachment(file, cloudFileName));
  }

  removeAttachmentEventHandler(e: RemoveEvent) {
    // this method is called one file at a time
    const file = e.files[0];
    file.name = `${file.uid}_${file.name}`;

    const index = this.uploadedFiles.findIndex(f => f.CloudFileName === file.name);
    if ( index >= 0 ) {
      this.uploadedFiles.splice(index, 1);
    }
  }
}
