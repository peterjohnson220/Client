import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromDashboardReducer from '../../reducers';
import * as fromDashboardActions from '../../actions/dashboard.actions';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models';

import { environment } from 'environments/environment';

import { Feature, UserVoiceModel } from '../../models';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: [ './dashboard.page.scss' ]
})
export class DashboardPageComponent implements OnInit {
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  features$: Observable<Feature[]>;
  userContext$: Observable<UserContext>;
  userVoiceModel: UserVoiceModel;

  constructor(private store: Store<fromDashboardReducer.State>) {
    this.loading$ = this.store.select(fromDashboardReducer.getFeaturesLoading);
    this.loadingError$ = this.store.select(fromDashboardReducer.getFeaturesLoadingError);
    this.features$ = this.store.select(fromDashboardReducer.getFeatures);
    this.userContext$ = store.select(fromRootState.getUserContext);
  }

  // Events
  handleFeaturesReload() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromDashboardActions.LoadingFeatures());
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
