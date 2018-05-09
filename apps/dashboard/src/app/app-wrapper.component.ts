import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromFeatureReducer from './_main/reducers';
import * as fromRootState from 'libs/state/state';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

import { FeatureTypes, Feature } from './_main/models';
import { UserContext } from 'libs/models/security';
import { CompanySettingDto } from 'libs/models/company';
import { GenericNameValueDto, SaveUiPersistenceSettingRequest } from 'libs/models/common';

declare var loadDrift: any;

@Component({
  selector: 'pf-app-wrapper',
  templateUrl: './app-wrapper.component.html'
})
export class AppWrapperComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  companySettings$: Observable<CompanySettingDto[]>;
  uiPersistenceSettings$: Observable<GenericNameValueDto[]>;
  features$: Observable<Feature[]>;
  displayRightSideBar: boolean;
  isRightSidebarOpen: boolean;
  rightSideBarOpenIcon = 'fa-comments';

  featureSubscription: any;
  userContextSubscription: any;
  uiPersistenceSubscription: any;

  constructor(private store: Store<fromFeatureReducer.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.companySettings$ = store.select(fromRootState.getCompanySettings);
    this.uiPersistenceSettings$ = store.select(fromRootState.getUiPersistenceSettings);
    this.features$ = this.store.select(fromFeatureReducer.getFeatures);

    this.store.dispatch(new fromCompanySettingsActions.GetCompanySettings());
    this.store.dispatch(new fromUiPersistenceSettingsActions.GetUiPersistenceSettings('Dashboard'));
  }

  static ShouldDisplayRightSideBar(features): boolean {
    const featuresInRightSideBar = [
      FeatureTypes.Activity,
      FeatureTypes.Community,
      FeatureTypes.JobDescriptions
    ];
    const minimumFeaturesThreshold = 1;
    return this.MinimumNumberOfFeaturesMet(features, featuresInRightSideBar, minimumFeaturesThreshold);
  }

  static MinimumNumberOfFeaturesMet(allFeatures, requiredFeatures, minThreshold): boolean {
    return allFeatures.filter(feature => requiredFeatures.indexOf(feature.Type) !== -1).length >= minThreshold;
  }

  static ShouldDisplayDrift(companySettings: CompanySettingDto[]): boolean {
    return companySettings
      .filter(s => s.Name === 'EnableLiveChat' && s.Value === 'True').length === 1;
  }

  ngOnInit(): void {
    this.featureSubscription = this.features$.subscribe(features => {
      this.displayRightSideBar = AppWrapperComponent.ShouldDisplayRightSideBar(features);
    });

    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      this.companySettings$.subscribe(companySettings => {
        if (companySettings != null && AppWrapperComponent.ShouldDisplayDrift(companySettings)) {
          loadDrift(userContext.UserId, userContext.EmailAddress, userContext.Name, userContext.CompanyName);
        }
      });
    });

    this.uiPersistenceSubscription = this.uiPersistenceSettings$.subscribe(uiPersistenceSettings => {
      if (uiPersistenceSettings != null) {
        this.isRightSidebarOpen = uiPersistenceSettings
          .filter(s => s.Name === 'RightSideBarIsOpen' && s.Value === 'true').length === 1;
      }
    });
  }

  ngOnDestroy(): void {
    this.featureSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.uiPersistenceSubscription.unsubscribe();
  }

  saveRightSidebarToggle(isOpen: boolean) {
    let isOpenString = 'false';
    if (isOpen) {
      isOpenString = 'true';
    }

    this.store.dispatch(new fromUiPersistenceSettingsActions.SavingUiPersistenceSetting({
      FeatureArea: 'Dashboard',
      SettingName: 'RightSideBarIsOpen',
      SettingValue: isOpenString
    } as SaveUiPersistenceSettingRequest));
  }
}
