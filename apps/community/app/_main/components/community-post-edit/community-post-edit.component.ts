import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityAttachment, CommunityPost, CommunityTopic, CommunityUpdatePost } from 'libs/models';

import * as fromCommunityPostReplyReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pf-community-post-edit',
  templateUrl: './community-post-edit.component.html',
  styleUrls: ['./community-post-edit.component.scss']
})
export class CommunityPostEditComponent implements OnInit, OnDestroy {
  @Input() post: CommunityPost;

  communityTopicSubscription: Subscription;

  communityAttachments: CommunityAttachment[];
  communityTopics: CommunityTopic[];
  communityTopics$: Observable<CommunityTopic[]>;
  pollsType = CommunityPollTypeEnum.DiscussionPoll;
  selectedTopic: CommunityTopic;
  selectedTopicId: string;

  constructor( public store: Store<fromCommunityPostReplyReducer.State>) {
    this.communityTopics$ = this.store.select(fromCommunityPostReplyReducer.getTopics);
  }

  ngOnInit() {
    this.communityTopicSubscription = this.communityTopics$.subscribe( topics => {
      if (topics) {
        this.communityTopics = topics;
        this.selectedTopic = topics.find(p => p.Id === this.post.Topic.Id);
      }
    });

    this.communityAttachments = this.post.Attachments;
  }

  ngOnDestroy() {
    this.communityTopicSubscription.unsubscribe();
  }

  savePost() {
    if (this.selectedTopic != null) {
      const updatedPost: CommunityUpdatePost = {
        PostId: this.post.Id,
        PostText: this.post.Content,
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
