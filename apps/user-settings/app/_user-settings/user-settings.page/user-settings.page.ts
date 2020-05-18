import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromUserSettingsReducer from '../reducers';
import * as fromUserSettingsActions from '../actions/user-settings-page.actions';
import { UserTile } from '../models';

@Component({
  selector: 'pf-user-settings-page',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss']
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  hasDashboardPreferences$: Observable<boolean>;
  getDashboardPreferencesHasPendingChanges$: Observable<boolean>;
  saveDashboardPreferencesResponse$: Observable<string>;
  userTiles$: Observable<AsyncStateObj<UserTile[]>>;

  hasDashboardPreferencesSub: Subscription;

  constructor(
    public store: Store<fromUserSettingsReducer.State>,
    private settingsService: SettingsService
  ) {
    this.hasDashboardPreferences$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DashboardPreferences
    );
    this.userTiles$ = this.store.pipe(select(fromUserSettingsReducer.getUserTilesAsync));
    this.getDashboardPreferencesHasPendingChanges$ = this.store.pipe(select(fromUserSettingsReducer.getDashboardPreferencesHasPendingChanges));
    this.saveDashboardPreferencesResponse$ = this.store.pipe(select(fromUserSettingsReducer.getSavedDashboardPreferencesResponse));
  }

  ngOnInit(): void {
    this.hasDashboardPreferencesSub = this.hasDashboardPreferences$.subscribe(hdp => {
      if (!!hdp && hdp) {
        this.store.dispatch(new fromUserSettingsActions.GetUserTiles());
      }
    });
  }

  ngOnDestroy() {
    this.hasDashboardPreferencesSub.unsubscribe();
  }

  toggleUserTile(userTile: UserTile) {
    this.store.dispatch(new fromUserSettingsActions.ToggleUserTile(userTile));
  }

  handleSaveClicked() {
    this.store.dispatch(new fromUserSettingsActions.SaveDashboardPreferences());
  }

  handleCancelClicked() {
    this.store.dispatch(new fromUserSettingsActions.CancelDashboardPreferencesChanges());
  }

}
