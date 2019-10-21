import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { AppNotification } from 'libs/features/app-notifications/models';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataViewActions from '../../../actions/data-view.actions';
import * as fromFiltersActions from '../../../actions/filters.actions';
import * as fromFieldsActions from '../../../actions/fields.actions';
import { SaveUserWorkbookModalData, SaveWorkbookMode, SharedDataViewUser, UserDataView } from '../../../models';
import { SaveUserWorkbookModalComponent, DeleteUserWorkbookModalComponent, ShareReportModalComponent } from '../../../components';

@Component({
  selector: 'pf-custom-report-view-page',
  templateUrl: './custom-report-view.page.html',
  styleUrls: ['./custom-report-view.page.scss']
})
export class CustomReportViewPageComponent implements OnInit, OnDestroy {
  @ViewChild('editWorkbookModal', { static: false }) public editUserWorkbookModalComponent: SaveUserWorkbookModalComponent;
  @ViewChild('duplicateWorkbookModal', { static: false }) public duplicateUserWorkbookModalComponent: SaveUserWorkbookModalComponent;
  @ViewChild('deleteWorkbookModal', { static: false }) public deleteUserWorkbookModalComponent: DeleteUserWorkbookModalComponent;
  @ViewChild('shareReportModal', { static: false }) public shareReportModalComponent: ShareReportModalComponent;

  userDataView$: Observable<AsyncStateObj<UserDataView>>;
  editingUserDataView$: Observable<boolean>;
  editUserDataViewConflict$: Observable<boolean>;
  editUserDataViewError$: Observable<boolean>;
  duplicatingUserReport$: Observable<boolean>;
  duplicateUserReportConflict$: Observable<boolean>;
  duplicateUserReportError$: Observable<boolean>;
  exportingUserDataReport$: Observable<boolean>;
  getNotification$: Observable<AppNotification<any>[]>;
  getEventId$: Observable<number>;
  shareableUsers$: Observable<AsyncStateObj<SharedDataViewUser[]>>;

  editReportSuccessSubscription: Subscription;
  duplicateReportSuccessSubscription: Subscription;
  userDataViewSubscription: Subscription;
  getNotificationSubscription: Subscription;
  getEventIdSubscription: Subscription;

  workbookModes = SaveWorkbookMode;
  editWorkbookData: SaveUserWorkbookModalData;
  duplicateWorkbookData: SaveUserWorkbookModalData;
  eventIdState = null;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
    private route: ActivatedRoute
  ) {
    this.userDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getUserDataViewAsync));
    this.editingUserDataView$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditingUserReport));
    this.editUserDataViewError$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportError));
    this.editUserDataViewConflict$ = this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportConflict));
    this.duplicatingUserReport$ = this.store.pipe(select(fromDataInsightsMainReducer.getDuplicatingUserReport));
    this.duplicateUserReportError$ = this.store.pipe(select(fromDataInsightsMainReducer.getDuplicateUserReportError));
    this.duplicateUserReportConflict$ = this.store.pipe(select(fromDataInsightsMainReducer.getDuplicateUserReportConflict));
    this.exportingUserDataReport$ = this.store.pipe(select(fromDataInsightsMainReducer.getExportingUserReport));
    this.getNotification$ = this.appNotificationStore.pipe(select(fromAppNotificationsMainReducer.getNotifications));
    this.getEventId$ = this.store.pipe(select(fromDataInsightsMainReducer.getExportEventId));
    this.shareableUsers$ = this.store.pipe(select(fromDataInsightsMainReducer.getShareableUsersAsync));
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadFieldsAndData(params['dataViewId']);
    });
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
    this.startSubscriptions();
  }

  ngOnDestroy(): void {
    this.editReportSuccessSubscription.unsubscribe();
    this.userDataViewSubscription.unsubscribe();
    this.duplicateReportSuccessSubscription.unsubscribe();
    this.getEventIdSubscription.unsubscribe();
    this.getNotificationSubscription.unsubscribe();
  }

  private loadFieldsAndData(dataViewId: number): void {
    const dataViewIdObj = { dataViewId };
    this.store.dispatch(new fromFiltersActions.ResetFilters());
    this.store.dispatch(new fromDataViewActions.GetUserDataView(dataViewIdObj));
    this.store.dispatch(new fromFieldsActions.GetReportFields(dataViewIdObj));
    this.store.dispatch(new fromDataViewActions.GetExportingUserReport(dataViewIdObj));
  }

  private startSubscriptions(): void {
    this.editReportSuccessSubscription =
      this.store.pipe(select(fromDataInsightsMainReducer.getEditUserReportSuccess)).subscribe(succeeded => {
        if (succeeded && this.editUserWorkbookModalComponent) {
          this.editUserWorkbookModalComponent.close();
        }
      });
    this.duplicateReportSuccessSubscription =
      this.store.pipe(select(fromDataInsightsMainReducer.getDuplicateUserReportSuccess)).subscribe(succeeded => {
        if (succeeded && this.duplicateUserWorkbookModalComponent) {
          this.duplicateUserWorkbookModalComponent.close();
        }
      });
    this.userDataViewSubscription = this.userDataView$.subscribe( u => {
      if (u.obj) {
        this.editWorkbookData = {
          Name: u.obj.Name,
          Summary: u.obj.Summary
        };
        this.duplicateWorkbookData = {
          Name: 'Copy of ' + u.obj.Name,
          Summary: u.obj.Summary
        };
      }
    });
  }

  handleEditClicked(): void {
    this.editUserWorkbookModalComponent.open();
  }

  handleDuplicateClicked(): void {
    this.duplicateUserWorkbookModalComponent.open();
  }

  handleDeleteClicked(): void {
    this.deleteUserWorkbookModalComponent.open();
  }

  handleEditSaveClicked(workbookData: SaveUserWorkbookModalData): void {
    this.store.dispatch(new fromDataViewActions.EditUserReport(workbookData));
  }

  handleDuplicateSaveClicked(workbookData: SaveUserWorkbookModalData): void {
    this.store.dispatch(new fromDataViewActions.DuplicateUserReport(workbookData));
  }

  handleDeleteSaveClicked(): void {
    this.store.dispatch(new fromDataViewActions.DeleteUserReport());
  }

  handleExportClicked(): void {
    this.store.dispatch(new fromDataViewActions.ExportUserReport());
  }

  handleShareClicked(): void {
    this.store.dispatch(new fromDataViewActions.GetShareableUsers());
    this.shareReportModalComponent.open();
  }

  handleShareSavedClicked(sharedDataViewUsers: SharedDataViewUser[]): void {
    this.store.dispatch(new fromDataViewActions.SaveSharePermissions(sharedDataViewUsers));
  }
}
