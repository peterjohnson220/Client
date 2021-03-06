import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models';

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
    { Title: TabName.CommunicationPreferences, Path: '/communication-preferences', IsVisible: true },
    { Title: TabName.PersonalProjectSettings, Path: '/personal-project-settings', IsVisible: true },
    { Title: TabName.DashboardPreferences, Path: '/dashboard-preferences', IsVisible: true }
  ];

  activeId = '/my-profile';

  constructor(
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
