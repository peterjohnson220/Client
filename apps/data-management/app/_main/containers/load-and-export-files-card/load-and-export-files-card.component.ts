import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { PermissionService } from 'libs/core';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import * as fromOrgDataNavigationLinkActions from 'libs/features/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';

@Component({
  selector: 'pf-load-and-export-files-card',
  templateUrl: './load-and-export-files-card.component.html',
  styleUrls: ['./load-and-export-files-card.component.scss'],
})
export class LoadAndExportFilesCardComponent implements OnInit, OnDestroy {

  manualImportOrgDataSubscription: Subscription;
  downloadOrgDataSubscription: Subscription;

  canImportOrgData: boolean;
  canExportOrgData: boolean;
  canExportPricingData: boolean;

  constructor(private settingsService: SettingsService,
    private permissionService: PermissionService,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private router: Router) {

  }

  ngOnInit() {
    this.manualImportOrgDataSubscription = this.settingsService
      .selectCompanySetting<string>(CompanySettingsEnum.ManualOrgDataLoadLink, 'string')
      .subscribe(setting => this.canImportOrgData = (setting === 'true'));
    this.canExportOrgData = this.permissionService
      .CheckPermission([Permissions.CAN_DOWNLOAD_ORGANIZATIONAL_DATA], PermissionCheckEnum.Single);
    this.canExportPricingData = this.permissionService
      .CheckPermission([Permissions.CAN_DOWNLOAD_PRICING_DATA], PermissionCheckEnum.Single);
  }

  ngOnDestroy() {
    this.manualImportOrgDataSubscription.unsubscribe();
  }

  canView() {
    return this.canImportOrgData || this.canExportOrgData || this.canExportPricingData;
  }

  handleOrgDataExportClick($event) {
    const notification = {
      NotificationId: '',
      Level: NotificationLevel.Info,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Title: 'Please wait while your file is built'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    };
    this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    this.notificationStore.dispatch(new fromOrgDataNavigationLinkActions.InitiateOrgDataExport());
    $event.preventDefault();
  }

  handlePricingDataExportClick($event) {
    this.router.navigate(['/pricing-loader/pricing-loaders-download']);
    $event.preventDefault();
  }
}
