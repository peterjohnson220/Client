import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';

@Component({
  selector: 'pf-communication-preferences',
  templateUrl: './communication-preferences.component.html',
  styleUrls: ['./communication-preferences.component.scss']
})
export class CommunicationPreferencesComponent implements OnInit {

  notificationsFeatureFlagEnabled: boolean;
  userContext$: Observable<UserContext>;

  constructor(private featureFlagService: AbstractFeatureFlagService, private store: Store<fromRootReducer.State>) {
    this.notificationsFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.UserNotifications, false);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
  }

  ngOnInit(): void {
  }
}
