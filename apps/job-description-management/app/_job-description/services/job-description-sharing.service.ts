import { Injectable } from '@angular/core';
import * as fromRootState from 'libs/state/state';
import { Observable, Subscription } from 'rxjs';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services';
import { UserContext } from 'libs/models';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
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
    private notificationStore: Store<fromAppNotificationsMainReducer.State>
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
    // TODO: once API exists, switch code to call api and remove dummy data
    // return this.payfactorsApiService.get(`${this.endpoint}/GetShares`, { companyId, jobDescriptionId });
    const dummyData = [
      {
        SharedTo: {
          EmailAddress: 'jeff.zhong@payscale.com',
          FirstName: 'Jeff',
          LastName: 'Zhong'
        },
        SharedBy: 'Lord Voldemort',
        SharedDate: new Date()
      },{
        SharedTo: {
          EmailAddress: 'nick.bissiri@payscale.com',
          FirstName: 'Nick',
          LastName: 'Bissiri'
        },
        SharedBy: 'Lord Voldemort',
        SharedDate: new Date()
      },{
        SharedTo: {
          EmailAddress: 'tom.faber@payscale.com',
          FirstName: 'Tom',
          LastName: 'Faber'
        },
        SharedBy: 'Lord Voldemort',
        SharedDate: new Date()
      }
    ];

    return new Observable<SharedJobDescription>(subscriber => {
      // * Uncomment this to view the dummy data in the share panel
      // dummyData.forEach(el => {
      //   subscriber.next(el);
      // })
      subscriber.complete();
    });
  }

  resendEmail() {
    // TODO: Have notification dependent on the api call
    // return this.payfactorsApiService.get(`${this.endpoint}/resendEmail`, { sharedEmail, jobDescriptionId });
    // * This notification should be dependent on the HTTP response from the apiService call
    const notification = {
      NotificationId: '',
      Level: NotificationLevel.Success,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Message: 'Email successfully sent'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    };
    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    return new Promise((resolve, reject) => {
      resolve(200)
    })
  }

  destroy() {
    this.identitySubscription.unsubscribe();
  }
}
