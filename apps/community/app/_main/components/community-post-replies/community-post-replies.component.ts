import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromCommunityPostReducer from '../../reducers';

import { CommunityReply } from 'libs/models/community';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-community-post-replies',
  templateUrl: './community-post-replies.component.html',
  styleUrls: ['./community-post-replies.component.scss'],
})
export class CommunityPostRepliesComponent {
  @Input() replies: CommunityReply[];
  @Input() loading: boolean;
  avatarUrl = environment.avatarSource;
  constructor(public store: Store<fromCommunityPostReducer.State>) {}
}
