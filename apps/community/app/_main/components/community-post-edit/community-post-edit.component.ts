import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityAttachment, CommunityPost, CommunityTopic, CommunityUpdatePost } from 'libs/models';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommunityConstants } from '../../models';

@Component({
  selector: 'pf-community-post-edit',
  templateUrl: './community-post-edit.component.html',
  styleUrls: ['./community-post-edit.component.scss']
})
export class CommunityPostEditComponent implements OnInit, OnDestroy {
  @Input() post: CommunityPost;

  communityTopicSubscription: Subscription;

  communityAttachments: CommunityAttachment[];
  communityPostEditForm: FormGroup;
  communityTopics: CommunityTopic[];
  editMaxLength =  CommunityConstants.DISCUSSION_MAX_TEXT_LENGTH;
  pollsType = CommunityPollTypeEnum.DiscussionPoll;
  selectedTopic: CommunityTopic;
  selectedTopicId: string;

  communityTopics$: Observable<CommunityTopic[]>;

  get content() { return this.communityPostEditForm.get('content'); }
  get topic() { return this.communityPostEditForm.get('topic'); }
  get isFormValid() { return this.communityPostEditForm.valid; }

  constructor( public store: Store<fromCommunityPostReplyReducer.State>, private formBuilder: FormBuilder) {
    this.communityTopics$ = this.store.select(fromCommunityPostReplyReducer.getTopics);

    this.communityPostEditForm = this.formBuilder.group({
      content:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.editMaxLength)]],
      topic: [null, [ Validators.required ]]
    });
  }

  ngOnInit() {
    this.communityTopicSubscription = this.communityTopics$.subscribe( topics => {
      if (topics) {
        this.communityTopics = topics;
        this.selectedTopic = topics.find(p => p.Id === this.post.Topic.Id);
      }
    });

    this.communityAttachments = this.post.Attachments;

    setTimeout(() => {
      this.content.setValue(this.post.Content);
    });

  }

  ngOnDestroy() {
    this.communityTopicSubscription.unsubscribe();
  }

  savePost() {
    this.topic.markAsTouched();
    this.content.markAsDirty();

    this.topic.setValue(this.selectedTopic);

    if (!this.communityPostEditForm.valid) {
      return;
    }

    const updatedPost: CommunityUpdatePost = {
      PostId: this.post.Id,
      PostText: this.content.value,
      Topic: this.selectedTopic,
      Attachments: this.communityAttachments
    };

    this.store.dispatch(new fromCommunityPostActions.SavingCommunityPostEdit(updatedPost));
  }

  cancelEdit() {
    this.store.dispatch(new fromCommunityPostActions.CancelEditingCommunityPost());
  }

  onAttachmentRemoved(fileName: string) {
    this.communityAttachments = this.communityAttachments.filter(x => x.CloudFileName !== fileName);
  }
}
