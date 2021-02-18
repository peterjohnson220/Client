import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { CloudFileLocations } from 'libs/constants';
import { CommunityPost, UserContext } from 'libs/models';
import { CommunityPollTypeEnum } from 'libs/models/community/community-constants.model';
import * as fromRootReducer from 'libs/state/state';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPostAddReplyViewActions from '../../actions/community-post-add-reply-view.actions';

@Component({
  selector: 'pf-community-post',
  templateUrl: './community-post.component.html',
  styleUrls: ['./community-post.component.scss']
})
export class CommunityPostComponent implements OnInit, OnDestroy {
  @Input() post: CommunityPost;
  @Input() maximumReplies: number;
  @Input() isModal: boolean;
  @Input() hideAttachmentWarning: boolean;
  @Input() showFileDownloadSecurityWarning: boolean;
  @Input() disableCommunityAttachments: boolean;

  @Output() filtersModifiedEvent = new EventEmitter<string>();
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  discardingPostId$: Observable<string>;
  discardingPostReplyProceed$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  discardingPostIdSubscription: Subscription;
  discardingPostReplyProceedSubscription: Subscription;
  userContextSub: Subscription;

  showAddReply = false;
  showReplies = false;
  discardingPostId = null;
  avatarUrl: string;
  companyLogoUrl: string;

  pollsType = CommunityPollTypeEnum.DiscussionPoll;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.discardingPostId$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyId);
    this.discardingPostReplyProceed$ = this.store.select(fromCommunityReducers.getDiscardingPostReplyProceed);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit() {
    if ( this.isModal ) {
      this.getReplies(this.post.Id);
    }

    this.discardingPostIdSubscription = this.discardingPostId$.subscribe(result => {
      if (result) {
        this.discardingPostId = result;
      }
    });

   this.discardingPostReplyProceedSubscription = this.discardingPostReplyProceed$.subscribe(result => {
      if (result && this.discardingPostId === this.post.Id) {
        this.showAddReply = false;
      }
    });
   this.userContextSub = this.userContext$.subscribe((userContext) => {
      this.avatarUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.UserAvatars;
      this.companyLogoUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.CompanyLogos;
    });
  }

  ngOnDestroy() {
    this.discardingPostIdSubscription.unsubscribe();
    this.discardingPostReplyProceedSubscription.unsubscribe();
    this.userContextSub.unsubscribe();
  }

  hashtagClicked(tagName: string) {
    this.filtersModifiedEvent.emit(tagName);
  }

  showReply() {
    this.showAddReply = !this.showAddReply;
  }

  onReplySubmitted() {
    this.showReply();
  }

  getReplies(postId) {
    this.showReplies = !this.showReplies;
    this.getCommunityPostReplies(postId);
  }

  hideReplies(postId) {
    this.showReplies = !this.showReplies;
    this.clearRepliesFromAddView();
    this.getCommunityPostReplies(postId);
  }

  getCommunityPostReplies(postId) {
    this.store.dispatch(new fromCommunityPostReplyActions.GettingCommunityPostReplies({ PostId: postId }));
  }

  clearRepliesFromAddView() {
    this.store.dispatch(new fromCommunityPostAddReplyViewActions.ClearingCommunityPostReplies());
  }

  hasReplies(post: CommunityPost) {
    return post.ReplyCount > 0 ? true : false;
  }

  handleAttachmentClickedEvent(event) {
    this.onAttachmentClickedEvent.emit(event);
  }

  handleFavoriteClick() {
    this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostFavorite(
      {postId: this.post.Id, favorite: !this.post.FavoritedByCurrentUser}));
  }
}
