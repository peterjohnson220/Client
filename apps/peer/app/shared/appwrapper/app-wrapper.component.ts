import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription, combineLatest } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { UserContext } from 'libs/models/security';

declare var loadDrift: any;

@Component({
    selector: 'pf-app-wrapper',
    templateUrl: './app-wrapper.component.html'
})

export class AppWrapperComponent implements OnInit, OnDestroy {
    userContext$: Observable<UserContext>;
    enableLiveChat$: Observable<boolean>;
    settingSubscription: Subscription;

    constructor(private store: Store<fromRootState.State>, private settingsService: SettingsService) {
        this.userContext$ = store.pipe(select(fromRootState.getUserContext));
        this.enableLiveChat$ = this.settingsService.selectLegacyCompanySetting<boolean>(CompanySettingsEnum.EnableLiveChat);
    }

    ngOnInit() {
      this.settingSubscription = combineLatest(this.userContext$, this.enableLiveChat$, (userContext, enableLiveChat) => ({userContext, enableLiveChat}))
        .subscribe(data => {
          if (data.enableLiveChat) {
            loadDrift(data.userContext.UserId, data.userContext.EmailAddress, data.userContext.Name, data.userContext.CompanyName);
          }
        });
    }

    ngOnDestroy() {
        this.settingSubscription.unsubscribe();
    }
}
