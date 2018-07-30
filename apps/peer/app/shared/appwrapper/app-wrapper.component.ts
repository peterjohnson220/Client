import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromFeatureReducer from '../../../../../apps/dashboard/app/_main/reducers';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';

import { CompanySettingDto } from 'libs/models/company';
import { UserContext } from 'libs/models/security';

declare var loadDrift: any;

@Component({
  selector: 'pf-app-wrapper',
  templateUrl: './app-wrapper.component.html'
})

export class AppWrapperComponent implements OnInit, OnDestroy {
  userContext$: Observable<UserContext>;
  companySettings$: Observable<CompanySettingDto[]>;
  userContextSubscription: Subscription;

  constructor(private store: Store<fromFeatureReducer.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.companySettings$ = store.select(fromRootState.getCompanySettings);

    this.store.dispatch(new fromCompanySettingsActions.GetCompanySettings());
  }

  static ShouldDisplayDrift(companySettings: CompanySettingDto[]): boolean {
    return companySettings
      .filter(s => s.Name === 'EnableLiveChat' && s.Value === 'True').length === 1;
  }

  ngOnInit() {
    this.userContextSubscription = this.userContext$.subscribe(userContext => {
      this.companySettings$.subscribe(companySettings => {
        if (companySettings != null && AppWrapperComponent.ShouldDisplayDrift(companySettings)) {
          loadDrift(userContext.UserId, userContext.EmailAddress, userContext.Name, userContext.CompanyName);
        }
      });
    });
  }

  ngOnDestroy() {
    this.userContextSubscription.unsubscribe();
  }
}
