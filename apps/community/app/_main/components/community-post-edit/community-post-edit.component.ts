import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { CommunityPost, CommunityTopic } from 'libs/models';

import * as fromCommunityPostReplyReducer from '../../reducers';

import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import { Observable, Subscription } from 'rxjs';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-post-edit',
  templateUrl: './community-post-edit.component.html',
  styleUrls: ['./community-post-edit.component.scss']
})
export class CommunityPostEditComponent implements OnInit, OnDestroy {
  @Input() post: CommunityPost;

  communityTopicSubscription: Subscription;

  pollsType = CommunityPollTypeEnum.DiscussionPoll;
  communityTopics$: Observable<CommunityTopic[]>;
  communityTopics: CommunityTopic[];
  selectedTopicId: string;
  selectedItem: CommunityTopic;


  constructor( public store: Store<fromCommunityPostReplyReducer.State>) {
    this.communityTopics$ = this.store.select(fromCommunityPostReplyReducer.getTopics);
  }

  ngOnInit() {
    this.communityTopicSubscription = this.communityTopics$.subscribe( topics => {
      if (topics) {
        this.communityTopics = topics;
        this.selectedItem = topics.find(p => p.Id === this.post.Topic.Id);
      }
    });
  }

  ngOnDestroy() {
    if (this.communityTopicSubscription) {
      this.communityTopicSubscription.unsubscribe();
    }
  }

  savePost() {
    if (this.selectedItem != null) {
      this.store.dispatch(new fromCommunityPostActions.SavingCommunityPostEdit(
        {postId: this.post.Id, topic: this.selectedItem}
      ));
    }
  }

  cancelEdit() {
    this.store.dispatch(new fromCommunityPostActions.CancelEditingCommunityPost());
  }

  handleTopicChange(topic) {
    this.selectedTopicId = topic;
  }
}
