import { Component, OnInit } from '@angular/core';

import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

@Component({
  selector: 'pf-communication-preferences',
  templateUrl: './communication-preferences.component.html',
  styleUrls: ['./communication-preferences.component.scss']
})
export class CommunicationPreferencesComponent implements OnInit {

  notificationsFeatureFlagEnabled: boolean;

  constructor(private featureFlagService: AbstractFeatureFlagService) {
    this.notificationsFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.UserNotifications, false);
  }

  ngOnInit(): void {
  }
}
