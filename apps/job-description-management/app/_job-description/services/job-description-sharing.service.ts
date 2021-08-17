import { Injectable } from '@angular/core';
import * as fromRootState from 'libs/state/state';
import { Observable, Subscription } from 'rxjs';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services';
import { UserContext } from 'libs/models';
import { Store } from '@ngrx/store';
import { SharedJobDescription } from '../models';

@Injectable()
export class JobDescriptionSharingService {
  private identity$: Observable<UserContext>;
  private identitySubscription: Subscription;
  private isSharingEnabled: boolean;
  private hasSharingPermission: boolean;
  private isInitialized: boolean;

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private userContextStore: Store<fromRootState.State>,
  ) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  init() {
    if (!this.isInitialized) {
      this.identitySubscription = this.identity$.subscribe(userContext => {
        // TODO: check the specific permission, separate story to add that in database:
        // this.permissionService.CheckPermission([Permissions.CAN_SHARE_JOB_DESCRIPTION], PermissionCheckEnum.Single) || true;
        const { AccessLevel, RoleName } = userContext;
        this.hasSharingPermission = AccessLevel === 'Admin' || RoleName === 'Company Admin';   
      });

      this.isSharingEnabled = this.featureFlagService.enabled(FeatureFlags.JobDescriptionSharing, false);
      this.isInitialized = true;
    }
  }

  allowSharing(): boolean {
    return this.isSharingEnabled && this.hasSharingPermission; 
  }

  getShares(companyId: number, jobDescriptionId: number) : Observable<SharedJobDescription> {
    // TODO: once API exists, switch code to call api like so:
    // return this.payfactorsApiService.get(`${this.endpoint}/GetShares`, { companyId, jobDescriptionId });
    return new Observable<SharedJobDescription>(subscriber => {
      subscriber.complete();
    });
  }

  destroy() {
    this.identitySubscription.unsubscribe();
  }
}
