import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AppNotification } from 'libs/features/infrastructure/app-notifications/models';
import { CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';
import { UserDataView, DataViewAccessLevel, SharedDataViewUser, Filter } from 'libs/ui/formula-editor';
import { CsvFileDelimiter, DataViewScope, ExportFileExtension } from 'libs/models/payfactors-api';
import { AbstractFeatureFlagService, FeatureFlags, PermissionService } from 'libs/core/services';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { TabularReportExportSchedule } from 'libs/features/reports/models/tabular-report-export-schedule.model';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import * as fromFiltersActions from '../../actions/filters.actions';
import {
  DeleteUserWorkbookModalComponent,
  ShareReportModalComponent,
  ConfigureSidebarComponent
} from '../../components';
import { EditDataViewModalComponent } from '../edit-data-view-modal';
import { DuplicateDataViewModalComponent } from '../duplicate-data-view-modal';
import { ScheduleExportModalComponent } from '../schedule-export-modal';

@Component({
  selector: 'pf-data-view-page',
  templateUrl: './data-view.page.html',
  styleUrls: ['./data-view.page.scss']
})
export class DataViewPageComponent implements OnInit, OnDestroy {
  @ViewChild('editDataViewModal') public editDataViewModal: EditDataViewModalComponent;
  @ViewChild('duplicateDataViewModal') public duplicateDataViewModal: DuplicateDataViewModalComponent;
  @ViewChild('deleteWorkbookModal') public deleteUserWorkbookModalComponent: DeleteUserWorkbookModalComponent;
  @ViewChild('shareReportModal') public shareReportModalComponent: ShareReportModalComponent;
  @ViewChild('scheduleExportModal') public scheduleExportModal: ScheduleExportModalComponent;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @ViewChild(ConfigureSidebarComponent) public configureSidebar: ConfigureSidebarComponent;

  userDataView$: Observable<AsyncStateObj<UserDataView>>;
  exportingUserDataReport$: Observable<boolean>;
  getNotification$: Observable<AppNotification<any>[]>;
  getEventId$: Observable<number>;
  shareableUsers$: Observable<AsyncStateObj<SharedDataViewUser[]>>;
  sharedUserPermissions$: Observable<AsyncStateObj<SharedDataViewUser[]>>;
  loadingErrorMessage$: Observable<string>;
  formulaBuilderEnabled$: Observable<boolean>;
  activeFilters$: Observable<Filter[]>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;
  savedSchedulesAsync$: Observable<AsyncStateObj<TabularReportExportSchedule[]>>;

  editReportSuccessSubscription: Subscription;
  duplicateReportSuccessSubscription: Subscription;
  userDataViewSubscription: Subscription;
  getNotificationSubscription: Subscription;
  getEventIdSubscription: Subscription;
  shareableUsersSubscription: Subscription;
  sharedUserPermissionsLoadedSubscription: Subscription;
  enableFileDownloadSecurityWarningSub: Subscription;
  getSavedSchedulesSubscription: Subscription;

  userDataView: UserDataView;
  eventIdState = null;
  dataViewAccessLevel: DataViewAccessLevel;
  shareableUsersLoaded: boolean;
  sharedUserPermissionsLoaded: boolean;
  scheduleTabularReportingExportFeatureFlagEnabled: boolean;
  hasScheduleTabularReportingExportPermission: boolean;
  enableFileDownloadSecurityWarning = false;
  exportData: any;
  isScheduled: boolean;
  dataViewId: number;

  constructor(
    private store: Store<fromDataViewMainReducer.State>,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
    private settingService: SettingsService,
    private route: ActivatedRoute,
    private featureFlagService: AbstractFeatureFlagService,
    private permissionService: PermissionService
) {
    this.userDataView$ = this.store.pipe(select(fromDataViewMainReducer.getUserDataViewAsync));
    this.exportingUserDataReport$ = this.store.pipe(select(fromDataViewMainReducer.getExportingUserReport));
    this.getNotification$ = this.appNotificationStore.pipe(select(fromAppNotificationsMainReducer.getNotifications));
    this.getEventId$ = this.store.pipe(select(fromDataViewMainReducer.getExportEventId));
    this.shareableUsers$ = this.store.pipe(select(fromDataViewMainReducer.getShareableUsersAsync));
    this.sharedUserPermissions$ = this.store.pipe(select(fromDataViewMainReducer.getSharedUserPermissionsAsync));
    this.loadingErrorMessage$ = this.store.pipe(select(fromDataViewMainReducer.getLoadingErrorMessage));
    this.activeFilters$ = this.store.pipe(select(fromDataViewMainReducer.getActiveFilters));
    this.formulaBuilderEnabled$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.DataInsightsFormulaBuilder);
    this.enableFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
    this.scheduleTabularReportingExportFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.ScheduleTabularReportingExport, false);
    this.hasScheduleTabularReportingExportPermission = this.permissionService.CheckPermission([Permissions.SCHEDULE_TABULAR_REPORT_EXPORT_DATA_INSIGHT],
      PermissionCheckEnum.Single);
    this.savedSchedulesAsync$ = this.store.select(fromDataViewMainReducer.getSavedSchedulesAsync);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadFieldsAndData(params['dataViewId']);
    });
    this.startSubscriptions();
  }

  ngOnDestroy(): void {
    this.editReportSuccessSubscription.unsubscribe();
    this.userDataViewSubscription.unsubscribe();
    this.duplicateReportSuccessSubscription.unsubscribe();
    this.getEventIdSubscription.unsubscribe();
    this.getNotificationSubscription.unsubscribe();
    this.shareableUsersSubscription.unsubscribe();
    this.getSavedSchedulesSubscription.unsubscribe();
  }

  private loadFieldsAndData(dataViewId: string): void {
    this.dataViewId = parseInt(dataViewId, 10);
    const dataViewIdObj = { dataViewId: this.dataViewId };
    this.store.dispatch(new fromFiltersActions.ResetFilters());
    this.store.dispatch(new fromDataViewActions.GetUserDataView(dataViewIdObj));
    this.store.dispatch(new fromDataViewActions.GetExportingUserReport(dataViewIdObj));
  }

  private startSubscriptions(): void {
    this.getEventIdSubscription = this.getEventId$.subscribe(eventId => {
      if (eventId !== this.eventIdState) {
        this.eventIdState = eventId;
      }
    });
    this.getNotificationSubscription = this.getNotification$.subscribe(notification => {
      const successNotification = notification.find((x) => x.Level === 'Success' && x.NotificationId === this.eventIdState) ;
      if (successNotification) {
        this.store.dispatch(new fromDataViewActions.ExportingComplete());
      }
    });
    this.editReportSuccessSubscription =
      this.store.pipe(select(fromDataViewMainReducer.getEditUserReportSuccess)).subscribe(succeeded => {
        if (succeeded && this.editDataViewModal) {
          this.editDataViewModal.close();
        }
      });
    this.duplicateReportSuccessSubscription =
      this.store.pipe(select(fromDataViewMainReducer.getDuplicateUserReportSuccess)).subscribe(succeeded => {
        if (succeeded && this.duplicateDataViewModal) {
          this.duplicateDataViewModal.close();
        }
      });
    this.userDataViewSubscription = this.userDataView$.subscribe(u => {
      if (u.obj) {
        this.userDataView = u.obj;
        this.dataViewAccessLevel = u.obj.AccessLevel;
      }
    });
    this.shareableUsersSubscription = this.shareableUsers$.subscribe(u => {
      this.shareableUsersLoaded = u.obj && u.obj.length > 0;
    });
    this.sharedUserPermissionsLoadedSubscription = this.store.pipe(select(fromDataViewMainReducer.getSharedUserPermissionsLoaded)).subscribe(loaded => {
      this.sharedUserPermissionsLoaded = loaded;
    });
    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
    this.getSavedSchedulesSubscription = this.savedSchedulesAsync$.subscribe(x =>
      this.isScheduled = x.obj.some(schedules => schedules.DataViewId === this.dataViewId));
  }

  handleEditClicked(): void {
    if (this.isReadOnly) {
      return;
    }
    this.editDataViewModal.open();
  }

  handleScheduleClicked(): void {
    const activeModal = this.scheduleExportModal.open();
    activeModal.componentInstance.userDataView = this.userDataView;
  }

  handleDuplicateClicked(): void {
    this.duplicateDataViewModal.open();
  }

  handleDeleteClicked(): void {
    if (!this.isOwner) {
      return;
    }
    this.deleteUserWorkbookModalComponent.open();
  }

  handleDeleteSaveClicked(): void {
    this.store.dispatch(new fromDataViewActions.DeleteUserReport());
  }

  handleExportClicked(data: { fileExtension: ExportFileExtension, csvFileDelimiter: CsvFileDelimiter }): void {
    this.exportData = data;

    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.export();
    }
  }

  handleShareClicked(): void {
    if (!this.canShare) {
      return;
    }
    if (!this.shareableUsersLoaded) {
      this.store.dispatch(new fromDataViewActions.GetShareableUsers());
    } else if (!this.sharedUserPermissionsLoaded) {
      this.store.dispatch(new fromDataViewActions.GetSharePermissions());
    }
    this.shareReportModalComponent.open();
  }

  handleShareSavedClicked(sharedDataViewUsers: SharedDataViewUser[]): void {
    this.store.dispatch(new fromDataViewActions.SaveSharePermissions(sharedDataViewUsers));
  }

  handleUserRemoved(user: SharedDataViewUser): void {
    this.store.dispatch(new fromDataViewActions.RemoveSharePermission(user));
  }

  handleSecurityWarningConfirmed(isConfirmed): void {
    if (isConfirmed) {
      this.export();
    }
  }

  export(): void {
    this.store.dispatch(new fromDataViewActions.ExportUserReport(this.exportData));
  }

  get isReadOnly(): boolean {
    return this.dataViewAccessLevel === DataViewAccessLevel.ReadOnly;
  }

  get isOwner(): boolean {
    return this.dataViewAccessLevel === DataViewAccessLevel.Owner;
  }

  get canShare(): boolean {
    return this.dataViewAccessLevel === DataViewAccessLevel.Owner && this.userDataView?.Scope === DataViewScope.Personal;
  }

  get configureSidebarOpen(): boolean {
    if (this.isReadOnly) {
      return false;
    }
    return this.configureSidebar ? this.configureSidebar.isOpen : true;
  }

}
