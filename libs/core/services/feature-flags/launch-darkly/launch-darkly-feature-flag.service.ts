import { Injectable } from '@angular/core';

import { initialize } from 'launchdarkly-js-client-sdk';
import { LDClient } from 'launchdarkly-js-client-sdk';
import { LDUser } from 'launchdarkly-js-sdk-common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AbstractFeatureFlagService, FeatureFlagChange, FeatureFlagContext, RealTimeFlag } from '../feature-flag.service';

@Injectable({
  providedIn: 'root'
})
export class LaunchDarklyFeatureFlagService extends AbstractFeatureFlagService {
  private featureFlagChanged: BehaviorSubject<FeatureFlagChange>;
  private client: LDClient;

  enabled(key: string, defaultValue= false, context?: FeatureFlagContext): boolean {
    if (!this.client) {
      console.warn(`LaunchDarkly client not initialized. Serving default value of ${defaultValue} for ${key} feature flag`);
      return defaultValue;
    }

    return this.client.variation(key, defaultValue);
  }

  initialize(sdkKey: string, context: FeatureFlagContext, initialFlags?: any): void {
    let options = {};

    if (!sdkKey) {
      return;
    }

    if (initialFlags) {
      options = { ...options, bootstrap: JSON.parse(initialFlags) };
    }

    this.client = initialize(sdkKey, this.mapLDUser(context), options);
    this.initializeOnChange();
  }

  bindEnabled(flag: RealTimeFlag, unSubscribe: Subject<void>): void {
    this.featureFlagChanged.pipe(takeUntil(unSubscribe)).subscribe((c) => flag.value = c[flag.key]);
  }

  private initializeOnChange(): void {
    const self = this;
    this.featureFlagChanged = new BehaviorSubject<FeatureFlagChange>(this.client.allFlags());
    this.client.on('change', () => self.featureFlagChanged.next(self.client.allFlags()));
  }

  private mapLDUser(context: FeatureFlagContext): LDUser {
  return {
    key: context.key.toString(),
    email: context.email,
    custom: context.attributes
  };
  }
}
