import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { UserVoiceLink } from 'libs/models/navigation/user-voice-link.model';

import { UserVoiceModel } from '../../models/user-voice.model';
import * as fromUserVoiceReducer from '../../reducers';
import * as fromUserVoiceActions from '../../actions/user-voice.actions';

@Component({
  selector: 'pf-user-voice-indicator',
  templateUrl: './user-voice-indicator.component.html',
  styleUrls: ['./user-voice-indicator.component.scss']
})
export class UserVoiceIndicatorComponent implements OnInit {

  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  userVoiceLink$: Observable<UserVoiceLink>;
  @Input() model: UserVoiceModel;

  constructor(private store: Store<fromUserVoiceReducer.State>) {
    this.loading$ = this.store.select(fromUserVoiceReducer.getUserVoiceLoading);
    this.loadingError$ = this.store.select(fromUserVoiceReducer.getUserVoiceLoadingError);
    this.userVoiceLink$ = this.store.select(fromUserVoiceReducer.getUserVoiceLink);
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromUserVoiceActions.LoadingUserVoice());
  }
}
