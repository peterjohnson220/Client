import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PermissionService } from 'libs/core';
import { CompanySettingsEnum, CompositeDataLoadViewResponse } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import * as fromJobDescriptionsExportActions from 'libs/features/job-description-management/actions/job-description-export.actions';
import * as fromOrgDataNavigationLinkActions from 'libs/features/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromLoadersDataActions from '../../actions/loaders-data.actions';

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
  canExportJobDescription: boolean;

  latestOrgDataLoad$: Observable<CompositeDataLoadViewResponse>;
  latestOrgDataLoadModalOpen$: Observable<boolean>;

  constructor(
    private store: Store<fromDataManagementMainReducer.State>,
    private settingsService: SettingsService,
    private permissionService: PermissionService,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private router: Router) {

  }

  ngOnInit() {
    this.store.dispatch(new fromLoadersDataActions.GetLatestOrgDataLoad());

    this.manualImportOrgDataSubscription = this.settingsService
      .selectCompanySetting<string>(CompanySettingsEnum.ManualOrgDataLoadLink, 'string')
      .subscribe(setting => this.canImportOrgData = (setting === 'true'));
    this.canExportOrgData = this.permissionService
      .CheckPermission([Permissions.CAN_DOWNLOAD_ORGANIZATIONAL_DATA], PermissionCheckEnum.Single);
    this.canExportPricingData = this.permissionService
      .CheckPermission([Permissions.CAN_DOWNLOAD_PRICING_DATA], PermissionCheckEnum.Single);
    this.latestOrgDataLoad$ = this.store.select(fromDataManagementMainReducer.getLatestOrgDataLoad);
    this.latestOrgDataLoadModalOpen$ = this.store.select(fromDataManagementMainReducer.getLatestOrgDataLoadModalOpen);
    this.canExportJobDescription = this.permissionService
      .CheckPermission([Permissions.CAN_DOWNLOAD_JOB_DESCRIPTION_DATA], PermissionCheckEnum.Single);
  }

  ngOnDestroy() {
    this.manualImportOrgDataSubscription.unsubscribe();
  }

  canView() {
    return this.canImportOrgData || this.canExportOrgData
      || this.canExportPricingData || this.canExportJobDescription;
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

  openOrgDataLoadModal($event) {
    $event.preventDefault();
    this.store.dispatch(new fromLoadersDataActions.OpenLatestOrgDataLoadModal());
  }

  handleJobDescriptionExportClick($event) {
    this.notificationStore.dispatch(new fromJobDescriptionsExportActions.InitiateJobDescriptionExport());
    $event.preventDefault();
  }
}
