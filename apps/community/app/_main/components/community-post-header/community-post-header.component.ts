import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { CommunityUserInfo } from 'libs/models/community/community-user-info.model';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import * as fromRootState from 'libs/state/state';
import { CommunityDeletePost } from '../../models/community-delete-post.model';
import { DownloadTypeEnum } from '../../models/download-type.enum';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';
import * as fromCommunityPostReplyActions from '../../actions/community-post-reply.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../actions/community-file-download-security-warning.actions';

@Component({
  selector: 'pf-community-post-header',
  templateUrl: './community-post-header.component.html',
  styleUrls: [ './community-post-header.component.scss' ]
})
export class CommunityPostHeaderComponent implements OnInit {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @Input() user: CommunityUserInfo;
  @Input() time: any;
  @Input() isInternalOnly: boolean;
  @Input() isCurrentUserPost: boolean;
  @Input() postId: string;
  @Input() replyId: string;
  @Input() isReply = false;
  @Input() isExpiredPoll = false;
  @Input() isUserPoll = false;
  @Input() userPollId: string;
  @Input() hasReplies: boolean;
  @Input() hidePostActions: boolean;
  enableFileDownloadSecurityWarning$: Observable<boolean>;
  enableFileDownloadSecurityWarningSub: Subscription;
  enableFileDownloadSecurityWarning = false;

  constructor(public store: Store<fromCommunityPostReducer.State>, private settingService: SettingsService) {
    this.enableFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }

  get hideUserActionsMenu() {
    return  !this.isCurrentUserPost && !this.isUserAdmin();
  }

  isUserAdmin(): boolean {
    let isSystemAdmin: boolean;

    this.store.select(fromRootState.getIsAdmin).pipe(
      take(1)
    ).subscribe(r => isSystemAdmin = r);

    return isSystemAdmin;
  }

  delete() {
    if (this.isReply) {
      this.deleteReply();
    } else {
      this.deletePost();
    }
  }

  deletePost() {
    const post: CommunityDeletePost = {
      PostId: this.postId,
      IsInternalOnly: this.isInternalOnly,
      HasReplies: this.hasReplies,
      IsUserPoll: this.isUserPoll };
      this.store.dispatch(new fromCommunityPostActions.DeletingCommunityPost(post));
  }

  deleteReply() {
    this.store.dispatch(new fromCommunityPostReplyActions.DeletingCommunityPostReply(
      { postId: this.postId, replyId: this.replyId}));
  }

  exportPollResults() {
    this.store.dispatch(new fromCommunityPollResponseActions.ExportingCommunityUserPollResponses(this.userPollId));
  }

  editPost() {
    if ( this.isReply ) {
      this.store.dispatch(new fromCommunityPostReplyActions.EditingCommunityPostReply(this.replyId));
    } else {
      this.store.dispatch(new fromCommunityPostActions.EditingCommunityPost(this.postId));
    }
  }

  handleExportPollResultsClicked() {
    if (this.enableFileDownloadSecurityWarning) {
      this.store.dispatch(new fromCommunityFileDownloadSecurityWarningActions.OpenCommunityFileDownloadSecurityWarningModal
      ({ downloadId: this.userPollId, downloadType: DownloadTypeEnum.CommunityUserPollExport }));
    } else {
      this.exportPollResults();
    }
  }
}
