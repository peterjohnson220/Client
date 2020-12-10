import { Component } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../reducers';
import * as fromDashboardPreferencesActions from '../../actions/dashboard-preferences.actions';
import { UserTile } from '../../models';

@Component({
  selector: 'pf-dashboard-preferences',
  templateUrl: './dashboard-preferences.component.html',
  styleUrls: ['./dashboard-preferences.component.scss']
})
export class DashboardPreferencesComponent {
  getDashboardPreferencesHasPendingChanges$: Observable<boolean>;
  saveDashboardPreferencesResponse$: Observable<string>;
  userTiles$: Observable<AsyncStateObj<UserTile[]>>;

  constructor(
    public store: Store<fromUserSettingsReducer.State>
  ) {
    this.userTiles$ = this.store.pipe(select(fromUserSettingsReducer.getUserTilesAsync));
    this.getDashboardPreferencesHasPendingChanges$ = this.store.pipe(select(fromUserSettingsReducer.getDashboardPreferencesHasPendingChanges));
    this.saveDashboardPreferencesResponse$ = this.store.pipe(select(fromUserSettingsReducer.getSavedDashboardPreferencesResponse));
  }

  toggleUserTile(userTile: UserTile) {
    this.store.dispatch(new fromDashboardPreferencesActions.ToggleUserTile(userTile));
  }

  handleSaveClicked() {
    this.store.dispatch(new fromDashboardPreferencesActions.SaveDashboardPreferences());
  }

  handleCancelClicked() {
    this.store.dispatch(new fromDashboardPreferencesActions.CancelDashboardPreferencesChanges());
  }
}
