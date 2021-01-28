import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CompositeDataLoadViewResponse, CompanySettingsEnum} from 'libs/models';
import * as fromJobDescriptionsExportActions from 'libs/features/jobs/job-description-management/actions/job-description-export.actions';
import * as fromOrgDataNavigationLinkActions from 'libs/features/infrastructure/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { SettingsService } from 'libs/state/app-context/services';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromLoadersDataActions from '../../actions/loaders-data.actions';

@Component({
  selector: 'pf-load-and-export-files-card',
  templateUrl: './load-and-export-files-card.component.html',
  styleUrls: ['./load-and-export-files-card.component.scss'],
})
export class LoadAndExportFilesCardComponent implements OnInit, OnDestroy {

  loadAndExportFilesCardStateSubscription: Subscription;

  unsubscribe$: Subject<boolean> = new Subject<boolean>();

  canImportOrgData: boolean;
  canExportOrgData: boolean;
  canExportPricingData: boolean;
  canExportJobDescription: boolean;
  canScheduleBulkExports: boolean;

  latestOrgDataLoad$: Observable<CompositeDataLoadViewResponse>;
  latestOrgDataLoadModalOpen$: Observable<boolean>;


  constructor(private store: Store<fromDataManagementMainReducer.State>,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,
    private settingsService: SettingsService) {
    this.latestOrgDataLoad$ = this.store.select(fromDataManagementMainReducer.getLatestOrgDataLoad);
    this.latestOrgDataLoadModalOpen$ = this.store.select(fromDataManagementMainReducer.getLatestOrgDataLoadModalOpen);
    this.settingsService
      .selectCompanySetting<string>(CompanySettingsEnum.ManualOrgDataLoadLink, 'string')
      .pipe(takeUntil(this.unsubscribe$), filter(v => !!v))
      .subscribe(setting => this.canImportOrgData = (setting === 'true'));
    this.store.select(fromDataManagementMainReducer.getLoadAndExportFilesCardState)
      .pipe(takeUntil(this.unsubscribe$), filter(v => !!v))
      .subscribe(v => {
        this.canExportOrgData = v.canExportOrgData;
        this.canExportPricingData = v.canExportPricingData;
        this.canExportJobDescription = v.canExportJobDescription;
        this.canScheduleBulkExports = v.canScheduleBulkExports;
      });
  }

  ngOnInit() {
    this.store.dispatch(new fromLoadersDataActions.GetLatestOrgDataLoad());
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  canView() {
    return this.canImportOrgData
      || this.canExportOrgData
      || this.canExportPricingData
      || this.canExportJobDescription
      || this.canScheduleBulkExports;
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

  openOrgDataLoadModal($event) {
    $event.preventDefault();
    this.store.dispatch(new fromLoadersDataActions.OpenLatestOrgDataLoadModal());
  }

  handleJobDescriptionExportClick($event) {
    this.notificationStore.dispatch(new fromJobDescriptionsExportActions.InitiateJobDescriptionExport());
    $event.preventDefault();
  }
}
