import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { NavigationLink } from 'libs/models';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import * as fromUserVoiceReducer from '../../reducers';
import * as fromUserVoiceActions from '../../actions/user-voice.actions';
import { userVoiceUrl } from 'libs/core/functions';


@Component({
  selector: 'pf-user-voice-indicator',
  templateUrl: './user-voice-indicator.component.html',
  styleUrls: ['./user-voice-indicator.component.scss']
})
export class UserVoiceIndicatorComponent implements OnInit {

  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  userVoiceLink$: Observable<NavigationLink>;
  userId: number;

  constructor(private store: Store<fromUserVoiceReducer.State>) {
    this.loading$ = this.store.select(fromUserVoiceReducer.getUserVoiceLoading);
    this.loadingError$ = this.store.select(fromUserVoiceReducer.getUserVoiceLoadingError);
    this.userVoiceLink$ = this.store.select(fromUserVoiceReducer.getUserVoiceLink);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromUserVoiceActions.LoadingUserVoice());
    this.userContext$.subscribe(userContext => {
        this.userId = userContext.UserId;
      }
    );
  }

  getSidebarHref(sidebarLinkUrl: string) {
      return userVoiceUrl(sidebarLinkUrl, this.userId);
  }
}
