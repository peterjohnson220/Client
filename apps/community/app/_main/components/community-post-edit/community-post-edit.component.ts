import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityAttachment, CommunityPost, CommunityTopic, CommunityUpdatePost } from 'libs/models';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { Observable, Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  communityTopics$: Observable<CommunityTopic[]>;
  editMaxLength = 2000;
  pollsType = CommunityPollTypeEnum.DiscussionPoll;
  selectedTopic: CommunityTopic;
  selectedTopicId: string;

  constructor( public store: Store<fromCommunityPostReplyReducer.State>, private formBuilder: FormBuilder) {
    this.communityTopics$ = this.store.select(fromCommunityPostReplyReducer.getTopics);

    this.communityPostEditForm = this.formBuilder.group({
      context:   ['', [ Validators.required, Validators.minLength(1), Validators.maxLength(this.editMaxLength)]]
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
      this.communityPostEditForm.controls['context'].setValue(this.post.Content);
    });
  }

  ngOnDestroy() {
    this.communityTopicSubscription.unsubscribe();
  }

  savePost() {
    if (this.selectedTopic != null) {
      const updatedPost: CommunityUpdatePost = {
        PostId: this.post.Id,
        PostText: this.communityPostEditForm.controls['context'].value,
        Topic: this.selectedTopic,
        Attachments: this.communityAttachments
      };

      this.store.dispatch(new fromCommunityPostActions.SavingCommunityPostEdit(updatedPost));
    }
  }

  cancelEdit() {
    this.store.dispatch(new fromCommunityPostActions.CancelEditingCommunityPost());
  }

  onAttachmentRemoved(fileName: string) {
    this.communityAttachments = this.communityAttachments.filter(x => x.CloudFileName !== fileName);
  }
}
