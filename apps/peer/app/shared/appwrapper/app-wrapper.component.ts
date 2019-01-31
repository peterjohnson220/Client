import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { LegacyCompanySettingDto } from 'libs/models/company';
import { UserContext } from 'libs/models/security';

declare var loadDrift: any;

@Component({
    selector: 'pf-app-wrapper',
    templateUrl: './app-wrapper.component.html'
})

export class AppWrapperComponent implements OnInit, OnDestroy {
    userContext$: Observable<UserContext>;
    legacyCompanySettings$: Observable<LegacyCompanySettingDto[]>;
    userContextSubscription: Subscription;

    constructor(private store: Store<fromRootState.State>) {
        this.userContext$ = store.pipe(select(fromRootState.getUserContext));
        this.legacyCompanySettings$ = store.pipe(select(fromRootState.getLegacyCompanySettings));
    }

    ngOnInit() {
        this.userContextSubscription = this.userContext$.subscribe(userContext => {
            this.legacyCompanySettings$.subscribe(companySettings => {
                if (companySettings != null) {
                    loadDrift(userContext.UserId, userContext.EmailAddress, userContext.Name, userContext.CompanyName);
                }
            });
        });
    }

    ngOnDestroy() {
        this.userContextSubscription.unsubscribe();
    }
}
