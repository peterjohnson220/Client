import { Component } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTileGridReducer from '../../reducers';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import { environment } from 'environments/environment';

import { UserVoiceModel } from '../../models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent {
  userContext$: Observable<UserContext>;
  userVoiceModel: UserVoiceModel;

  constructor(private store: Store<fromTileGridReducer.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.inflateUserVoiceModel();
  }

  inflateUserVoiceModel(): void {
    this.userContext$.subscribe(userContext =>
      this.userVoiceModel = {
        userId: userContext.UserId,
        userVoiceUrl: environment.userVoiceUrl,
        userVoiceForumId: environment.userVoiceForumId
      }
    );
  }
}
