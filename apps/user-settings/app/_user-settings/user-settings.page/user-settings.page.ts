import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models';

import * as fromUserSettingsReducer from '../reducers';
import * as fromDashboardPreferencesActions from '../actions/dashboard-preferences.actions';
import { Tab, TabName } from '../models';

@Component({
  selector: 'pf-user-settings-page',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss']
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  hasDashboardPreferences$: Observable<boolean>;

  hasDashboardPreferencesSub: Subscription;
  navigationEndSubscription: Subscription;

  tabs: Tab[] = [
    { Title: TabName.MyProfile, Path: '/my-profile', IsVisible: true },
    { Title: TabName.DashboardPreferences, Path: '/dashboard-preferences', IsVisible: true }
  ];

  activeId = '/my-profile';

  constructor(
    public store: Store<fromUserSettingsReducer.State>,
    private settingsService: SettingsService,
    public router: Router
  ) {
    this.hasDashboardPreferences$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DashboardPreferences
    );
    this.navigationEndSubscription = this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd)
    ).subscribe((navEndEvent: NavigationEnd) => {
      this.activeId = navEndEvent?.url;
    });
  }

  ngOnInit(): void {
    this.hasDashboardPreferencesSub = this.hasDashboardPreferences$.subscribe(settingEnabled => {
      if (settingEnabled) {
        this.store.dispatch(new fromDashboardPreferencesActions.GetUserTiles());
      }
      if (settingEnabled === false) {
        this.hideDashboardPreferencesTab();
      }
    });
  }

  ngOnDestroy() {
    this.navigationEndSubscription.unsubscribe();
    this.hasDashboardPreferencesSub.unsubscribe();
  }

  private hideDashboardPreferencesTab(): void {
    const dashboardPreferencesTab = this.tabs.find(t => t.Title === TabName.DashboardPreferences);
    if (dashboardPreferencesTab) {
      dashboardPreferencesTab.IsVisible = false;
    }
  }
}
