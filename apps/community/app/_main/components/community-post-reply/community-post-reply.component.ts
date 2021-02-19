import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import { CloudFileLocations } from 'libs/constants';
import { UserContext, CommunityReply } from 'libs/models';
import * as fromRootState from 'libs/state/state';

@Component({
  selector: 'pf-community-post-reply',
  templateUrl: './community-post-reply.component.html',
  styleUrls: ['./community-post-reply.component.scss'],
})
export class CommunityPostReplyComponent implements OnInit, OnDestroy {
  @Input() reply: CommunityReply;
  @Input() disableCommunityAttachments: boolean;
  @Input() hideAttachmentWarning: boolean;
  @Input() showFileDownloadSecurityWarning: boolean;
  @Output() replyHashTagClicked = new EventEmitter();
  @Output() onAttachmentClickedEvent = new EventEmitter<string>();

  public avatarUrl: string;
  public companyLogoUrl: string;
  public userContext$: Observable<UserContext>;
  private userContextSub: Subscription;

  constructor(private rootStore: Store<fromRootState.State>) {
    this.userContext$ = this.rootStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.userContextSub = this.userContext$.subscribe((userContext) => {
      this.avatarUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.UserAvatars;
      this.companyLogoUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value + CloudFileLocations.CompanyLogos;
    });
  }

  ngOnDestroy() {
    this.userContextSub.unsubscribe();
  }

  handleHashTagClicked(event: any) {
    this.replyHashTagClicked.emit(event);
  }

  handleAttachmentClickedEvent(event) {
    this.onAttachmentClickedEvent.emit(event);
  }
}
