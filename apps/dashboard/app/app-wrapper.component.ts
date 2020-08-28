import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { UserContext } from 'libs/models/security';
import { LegacyCompanySettingDto } from 'libs/models/company';
import { FeatureAreaConstants, GenericNameValueDto, SaveUiPersistenceSettingRequest, UiPersistenceSettingConstants } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import { FeatureTypes, Feature } from './_main/models';
import * as fromFeatureReducer from './_main/reducers';

declare var loadDrift: any;

@Component({
  selector: 'pf-app-wrapper',
  templateUrl: './app-wrapper.component.html'
})
export class AppWrapperComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  legacyCompanySettings$: Observable<LegacyCompanySettingDto[]>;
  uiPersistenceSettings$: Observable<GenericNameValueDto[]>;
  features$: Observable<Feature[]>;
  displayRightSideBar: boolean;
  isRightSidebarOpen: boolean;
  rightSideBarOpenIcon = 'comments';
  userNotificationsFeatureFlag: RealTimeFlag = { key: FeatureFlags.UserNotifications, value: false };
  unsubscribe$ = new Subject<void>();

  featureSubscription: any;
  userContextSubscription: any;
  uiPersistenceSubscription: any;

  constructor(private store: Store<fromFeatureReducer.State>,
              private settingsService: SettingsService,
              private featureFlagService: AbstractFeatureFlagService) {
    this.userContext$ = store.pipe(select(fromRootState.getUserContext));
    this.legacyCompanySettings$ = store.pipe(select(fromRootState.getLegacyCompanySettings));
    this.uiPersistenceSettings$ = settingsService.selectUiPersistenceFeatureSettings(FeatureAreaConstants.Dashboard);
    this.features$ = this.store.pipe(select(fromFeatureReducer.getFeatures));
    this.featureFlagService.bindEnabled(this.userNotificationsFeatureFlag, this.unsubscribe$);
  }

  static ShouldDisplayDrift(companySettings: LegacyCompanySettingDto[]): boolean {
    return companySettings
      .filter(s => s.Name === 'EnableLiveChat' && s.Value === 'True').length === 1;
  }

  static ShouldDisplayRightSideBar(features): boolean {
    const featuresInRightSideBar = [
      FeatureTypes.Activity,
      FeatureTypes.Community,
      FeatureTypes.NewCommunity,
      FeatureTypes.JobDescriptions
    ];
    const minimumFeaturesThreshold = 1;
    return this.MinimumNumberOfFeaturesMet(features, featuresInRightSideBar, minimumFeaturesThreshold);
  }

  static MinimumNumberOfFeaturesMet(allFeatures, requiredFeatures, minThreshold): boolean {
    return allFeatures.filter(feature => requiredFeatures.indexOf(feature.Type) !== -1).length >= minThreshold;
  }

  ngOnInit(): void {

    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      this.legacyCompanySettings$.subscribe(companySettings => {
        if (companySettings != null && AppWrapperComponent.ShouldDisplayDrift(companySettings)) {
          loadDrift(userContext.UserId, userContext.EmailAddress, userContext.Name, userContext.CompanyName);
        }
      });
    });

    this.featureSubscription = this.features$.subscribe(features => {
      this.displayRightSideBar = AppWrapperComponent.ShouldDisplayRightSideBar(features);
    });

    this.uiPersistenceSubscription = this.uiPersistenceSettings$.subscribe(uiPersistenceSettings => {
      if (uiPersistenceSettings != null) {
        this.isRightSidebarOpen = uiPersistenceSettings
          .filter(s => s.Name === UiPersistenceSettingConstants.RightSideBarIsOpen &&
            s.Value === 'true').length === 1;
      }
    });
  }

  ngOnDestroy(): void {
    this.featureSubscription.unsubscribe();
    this.uiPersistenceSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.unsubscribe$.next();
  }

  saveRightSidebarToggle(isOpen: boolean) {
    let isOpenString = 'false';
    if (isOpen) {
      isOpenString = 'true';
    }

    this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
      FeatureArea: FeatureAreaConstants.Dashboard,
      SettingName: UiPersistenceSettingConstants.RightSideBarIsOpen,
      SettingValue: isOpenString
    } as SaveUiPersistenceSettingRequest));
  }
}
