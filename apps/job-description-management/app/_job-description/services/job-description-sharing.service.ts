import { Injectable } from '@angular/core';
import * as fromRootState from 'libs/state/state';
import { Observable, Subscription } from 'rxjs';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services';
import { UserContext } from 'libs/models';
import { Store } from '@ngrx/store';
import { SharedJobDescriptionUser, ShareJobEmail } from '../models';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

@Injectable()
export class JobDescriptionSharingService {
  private identity$: Observable<UserContext>;
  private identitySubscription: Subscription;
  private isSharingEnabled: boolean;
  private hasSharingPermission: boolean;
  private isInitialized: boolean;
  private endpoint = 'JobDescriptionSharing';

  constructor(
    private featureFlagService: AbstractFeatureFlagService,
    private userContextStore: Store<fromRootState.State>,
    private payfactorsApiService: PayfactorsApiService
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

  // Function to send emails via sendgrid
  sendEmails(jobDescriptions: Map<number, any>, emailList: ShareJobEmail[]): Observable<any> {
    if(jobDescriptions && emailList) {
      // Break the emailList into internal and external, internals will have a userId
      const internalUserIds = [];
      const externalUserEmailAddresses = [];
      const jobDescriptionIds = [...jobDescriptions.keys()];
      for(const el of emailList) {
        if(el.UserId) {
          internalUserIds.push(el.UserId);
        }
        else externalUserEmailAddresses.push(el.EmailAddress);
      }
      return this.payfactorsApiService.post<any>(`${this.endpoint}/ShareSet`, { internalUserIds, externalUserEmailAddresses, jobDescriptionIds }, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.Default, false, { observe: 'response' })
    }
  }

  getSharedUsers(jobDescriptionId: number) : Observable<SharedJobDescriptionUser[]> {
    return this.payfactorsApiService.get(`${this.endpoint}/SharedUsers?jobDescriptionId=${jobDescriptionId}`);
  }

  resendEmail() {
    // TODO: Have notification dependent on the api call
    // return this.payfactorsApiService.get(`${this.endpoint}/resendEmail`, { sharedEmail, jobDescriptionId });
  }

  destroy() {
    this.identitySubscription.unsubscribe();
  }
}
