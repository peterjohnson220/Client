import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromFeatureReducer from './_main/reducers';
import * as fromRootState from 'libs/state/state';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';

import { FeatureTypes, Feature } from './_main/models';
import { UserContext } from 'libs/models/security';
import { CompanySettingDto } from 'libs/models/company';

declare var loadDrift: any;

@Component({
  selector: 'pf-app-wrapper',
  templateUrl: './app-wrapper.component.html'
})
export class AppWrapperComponent implements OnInit {
  userContext$: Observable<UserContext>;
  companySettings$: Observable<CompanySettingDto[]>;
  features$: Observable<Feature[]>;
  displayRightSideBar: boolean;
  rightSideBarOpenIcon = 'fa-comments';

  constructor(private store: Store<fromFeatureReducer.State>) {
    this.store.dispatch(new fromCompanySettingsActions.GetCompanySettings());
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.companySettings$ = store.select(fromRootState.getCompanySettings);
    this.features$ = this.store.select(fromFeatureReducer.getFeatures);
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

  ngOnInit() {
    this.features$.subscribe(features =>
      this.displayRightSideBar = AppWrapperComponent.ShouldDisplayRightSideBar(features)
    );

    this.userContext$.subscribe(userContext => {
      this.companySettings$.subscribe(companySettings => {
        if (companySettings != null && AppWrapperComponent.ShouldDisplayDrift(companySettings)) {
          loadDrift(userContext.UserId, userContext.EmailAddress, userContext.Name, userContext.CompanyName);
        }
      });
    });
  }
}
