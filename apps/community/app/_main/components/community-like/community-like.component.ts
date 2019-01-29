import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromCommunityReducer from '../../reducers';
import * as fromCommunityLikeActions from '../../actions/community-like.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';

import { CommunityUserInfo } from 'libs/models';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'pf-community-like',
  templateUrl: './community-like.component.html',
  styleUrls: ['./community-like.component.scss']
})
export class CommunityLikeComponent implements OnInit, OnDestroy {

  @Input() LikedByCurrentUser: boolean;
  @Input() PostId: string;
  @Input() ReplyId: string;
  @Input() LikeCount: number;
  @Input() UserId: string;

  communityLikeUserInfos: CommunityUserInfo[] = [];

  communityLikeLoadingSubscription: Subscription;
  communityLikeLoadedSubscription: Subscription;

  communityLikes$: Observable<CommunityUserInfo[]>;
  communityLikesLoading$: Observable<boolean>;
  loadingLikes = false;

  MAX_LIKES_TO_DISPLAY = 20;

  constructor(public store: Store<fromCommunityReducer.State>) {
    this.communityLikesLoading$ = this.store.select(fromCommunityReducer.getLoadingCommunityLikes);
    this.communityLikes$ = this.store.select(fromCommunityReducer.getLoadingCommunityLikesSuccess);
  }

  ngOnInit() {
    this.communityLikeLoadingSubscription = this.communityLikesLoading$.subscribe(response => {
      this.loadingLikes = response;
    });

    this.communityLikeLoadedSubscription = this.communityLikes$.subscribe(response => {
      this.communityLikeUserInfos = [];
      if (response) {
        this.communityLikeUserInfos = response;
      }
    });
  }

  ngOnDestroy() {
    if (this.communityLikeLoadedSubscription) {
      this.communityLikeLoadedSubscription.unsubscribe();
    }
    if (this.communityLikeLoadingSubscription) {
      this.communityLikeLoadingSubscription.unsubscribe();
    }
  }

  updateLike() {
    if (this.ReplyId) {
      this.store.dispatch(new fromCommunityPostReplyActions.UpdatingCommunityPostReplyLike(
      {postId: this.PostId, replyId: this.ReplyId, like: ! this.LikedByCurrentUser}));
    } else {
      this.store.dispatch(new fromCommunityPostActions.UpdatingCommunityPostLike(
      {postId: this.PostId, like: !this.LikedByCurrentUser, userId: this.UserId}));
    }
  }

  mouseEnter() {
    this.communityLikeUserInfos = [];
    this.store.dispatch(new fromCommunityLikeActions.LoadingCommunityLikes(
      {postId: this.PostId, replyId: this.ReplyId}));
  }

  getTooltipText() {
    let tooltipText = '';
    for (let i = 0; i < this.communityLikeUserInfos.length; i++) {
      tooltipText = tooltipText + this.communityLikeUserInfos[i].UserFirstName +  ' '
        + this.communityLikeUserInfos[i].UserLastName;
      if ( i >= this.MAX_LIKES_TO_DISPLAY - 1) {
        tooltipText += '\r\n ' + `and ${ this.LikeCount - i } more...`;
        break;
      } else if (i < this.communityLikeUserInfos.length - 1) {
        tooltipText += '\r\n';
      }
    }

    if (tooltipText.length === 0 && ! this.loadingLikes) {
      return 'No likes...';
    } else {
      return tooltipText;
    }
  }
}
