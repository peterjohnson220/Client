import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum, UserContext, UserProfile } from 'libs/models';

import * as fromUserSettingsReducer from '../reducers';
import * as fromDashboardPreferencesActions from '../actions/dashboard-preferences.actions';
import * as fromUserProfileActions from '../actions/user-profile.actions';
import { Tab, TabName } from '../models';

@Component({
  selector: 'pf-user-settings-page',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss']
})
export class UserSettingsPageComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  hasDashboardPreferences$: Observable<boolean>;

  hasDashboardPreferencesSub: Subscription;
  navigationEndSubscription: Subscription;
  userContextSubscription: Subscription;

  tabs: Tab[] = [
    { Title: TabName.MyProfile, Path: '/my-profile', IsVisible: true },
    { Title: TabName.PersonalProjectSettings, Path: '/personal-project-settings', IsVisible: true },
    { Title: TabName.DashboardPreferences, Path: '/dashboard-preferences', IsVisible: true }
  ];

  activeId = '/my-profile';

  constructor(
    private rootStore: Store<fromRootState.State>,
    public store: Store<fromUserSettingsReducer.State>,
    private settingsService: SettingsService,
    public router: Router
  ) {
    this.userContext$ = this.rootStore.pipe(select(fromRootState.getUserContext));
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
    this.userContextSubscription = this.userContext$.subscribe(uc => this.setUserProfile(uc));
  }

  ngOnDestroy() {
    this.navigationEndSubscription.unsubscribe();
    this.hasDashboardPreferencesSub.unsubscribe();
    this.userContextSubscription.unsubscribe();
  }

  private hideDashboardPreferencesTab(): void {
    const dashboardPreferencesTab = this.tabs.find(t => t.Title === TabName.DashboardPreferences);
    if (dashboardPreferencesTab) {
      dashboardPreferencesTab.IsVisible = false;
    }
  }

  private setUserProfile(userContext: UserContext): void {
    if (!userContext) {
      return;
    }
    const cloudFilesPublicBaseUrl = userContext.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl')?.Value;
    const userProfile: UserProfile = {
      UserId: userContext.UserId,
      FirstName: userContext.FirstName,
      LastName: userContext.LastName,
      EmailAddress: userContext.EmailAddress,
      Title: userContext.Title,
      UserPicture: userContext.UserPicture
    };

    this.store.dispatch(new fromUserProfileActions.SetUserProfile({ userProfile, cloudFilesPublicBaseUrl }));
  }
}
