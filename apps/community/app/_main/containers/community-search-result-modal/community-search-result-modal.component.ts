import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CommunityPost } from 'libs/models';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import * as fromCommunitySearchPostReducer from '../../reducers';
import * as fromCommunitySearchActions from '../../actions/community-search.actions';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityAttachmentWarningActions from '../../actions/community-attachment-warning.actions';

@Component({
  selector: 'pf-community-search-result-modal',
  templateUrl: './community-search-result-modal.component.html',
  styleUrls: ['./community-search-result-modal.component.scss']
})

export class CommunitySearchResultModalComponent implements OnInit, OnDestroy {
  communitySearchResultModal$: Observable<any>;
  communitySearchResultModalSubscription: Subscription;

  communityPost$: Observable<any>;
  communityPostSubscription: Subscription;

  communityPostEdited$: Observable<any>;
  postEditedSubscription: Subscription;

  disableCommunityAttachments$: Observable<boolean>;
  maximumReplies$: Observable<number>;
  loadingCommunityPost$: Observable<boolean>;
  loadingCommunityPostError$: Observable<boolean>;
  communityPostDeleted$: Observable<any>;

  hideAttachmentWarning$: Observable<boolean>;
  hideAttachmentWarningSubscription: Subscription;
  hideAttachmentWarning: boolean;

  showFileDownloadSecurityWarning$: Observable<boolean>;
  showFileDownloadSecurityWarningSubscription: Subscription;
  showFileDownloadSecurityWarning: boolean;

  communityPost: CommunityPost;
  isSystemAdmin: boolean;
  isUserPoll: boolean;
  editedPostId: string;

  constructor(public store: Store<fromCommunitySearchPostReducer.State>,
              private router: Router,
              private settingService: SettingsService) {
    this.communitySearchResultModal$ = this.store.select(fromCommunitySearchPostReducer.getCommunitySearchResultModal);

    this.communityPost$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostCombinedWithReplies);
    this.disableCommunityAttachments$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.CommunityDisableAttachments);
    this.loadingCommunityPost$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPost);
    this.loadingCommunityPostError$ = this.store.select(fromCommunitySearchPostReducer.getLoadingCommunityPostError);

    this.maximumReplies$ = this.store.select(fromCommunitySearchPostReducer.getMaximumReplies);

    this.communityPostDeleted$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostDeleted);
    this.communityPostEdited$ = this.store.select(fromCommunitySearchPostReducer.getCommunityPostEdited);

    this.hideAttachmentWarning$ = this.settingService.selectUiPersistenceSetting(
      FeatureAreaConstants.Community, UiPersistenceSettingConstants.CommunityHideAttachmentWarningModal, 'boolean');

    this.showFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.communitySearchResultModalSubscription = this.communitySearchResultModal$.subscribe(postId => {
      if (postId != null) {
        this.store.dispatch(new fromCommunityPostActions.GettingCommunityPost(postId));
      }
    });

    this.communityPostSubscription = this.communityPost$.subscribe(post => {
      this.communityPost = post;
      if (post) {
        this.isUserPoll = post.UserPollRequest ? true : false;
      }
    });

    this.postEditedSubscription = this.communityPostEdited$.subscribe( postId => {
      this.editedPostId = postId;
    });

    this.hideAttachmentWarningSubscription = this.hideAttachmentWarning$.subscribe(value => {
      if (value != null) {
        this.hideAttachmentWarning = value;
      }
    });

    this.showFileDownloadSecurityWarningSubscription = this.showFileDownloadSecurityWarning$.subscribe(value => {
      if (value) {
        this.showFileDownloadSecurityWarning = value;
      }
    });
  }

  ngOnDestroy() {
    if (this.communitySearchResultModalSubscription) {
      this.communitySearchResultModalSubscription.unsubscribe();
    }

    if (this.communityPostSubscription) {
      this.communityPostSubscription.unsubscribe();
    }

    if (this.postEditedSubscription) {
      this.postEditedSubscription.unsubscribe();
    }

    if (this.hideAttachmentWarningSubscription) {
      this.hideAttachmentWarningSubscription.unsubscribe();
    }

    if (this.showFileDownloadSecurityWarningSubscription) {
      this.showFileDownloadSecurityWarningSubscription.unsubscribe();
    }
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromCommunitySearchActions.CloseSearchResultModal);
    this.communityPost = null;
  }

  handleAttachmentClickedEvent(event) {
    this.store.dispatch(new fromCommunityAttachmentWarningActions.OpenCommunityAttachmentsWarningModal(event));
  }

  hashtagClicked(hashTagName: string) {
    this.handleModalDismissed();

    if (hashTagName && hashTagName.substr(0, 1) === '#') {

      const hashTagText = hashTagName.substr(1);
      this.router.navigate([ `/dashboard/tag/${hashTagText}` ]);
    }
  }

  getTitle() {
    return this.isUserPoll ? 'Community Poll' : 'Community Discussion';
  }

  getDeletedMessage() {
    return this.isUserPoll ? 'Poll successfully deleted.' : 'Post successfully deleted.';
  }
}
