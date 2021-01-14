import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoUpload, KendoUploadStatus, UserContext } from 'libs/models';
import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { AppNotification } from 'libs/features/infrastructure/app-notifications/models';
import { CompanyResourceFolder, OrphanedCompanyResource } from '../models/company-resources.model';
import * as fromCompanyResourcesPageActions from '../actions/company-resources.actions';
import * as fromCompanyResourcesAddResourceActions from '../actions/company-resources-add-resource.actions';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromCompanyResourcesPageReducer from '../reducers';
import { ResourceModalComponent } from '../containers/resource-modal/resource-modal.component';
import { NewFolderModalComponent } from '../containers/new-folder-modal/new-folder-modal.component';
import { CompanyResourceUploadState } from '../models/company-resource-upload-state.model';

@Component({
  selector: 'pf-company-resources',
  templateUrl: './company-resources.page.html',
  styleUrls: ['./company-resources.page.scss']
})
export class CompanyResourcesPageComponent implements OnInit, OnDestroy {
  addingFolderSuccessSubscription: Subscription;
  addingResourceSuccessSubscription: Subscription;
  companyName: string;
  companyResourceUploads: KendoUpload[];
  companyResourceUploadState$: Observable<CompanyResourceUploadState>;
  companyResourceUploadStateSubscription: Subscription;
  companyResourcesLoading$: Observable<boolean>;
  companyResourcesLoadingError$: Observable<boolean>;
  folderResources$: Observable<CompanyResourceFolder[]>;
  folderSuccess$: Observable<boolean>;
  getNotification$: Observable<AppNotification<any>[]>;
  getNotificationSubscription: Subscription;
  identity$: Observable<UserContext>;
  indentitySubscription: Subscription;
  loadingError$: Observable<boolean>;
  modalReference: NgbModalRef;
  orphanedResources$: Observable<OrphanedCompanyResource[]>;
  resourceSuccess$: Observable<boolean>;

  constructor(
    private store: Store<fromCompanyResourcesPageReducer.State>,
    private rootStore: Store<fromRootState.State>,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.companyResourcesLoading$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoading);
    this.companyResourcesLoadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.companyResourceUploadState$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesUploadState);
    this.folderResources$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyFolderResources);
    this.folderSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getAddingFolderToCompanyResourcesSuccess);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
    this.identity$ = this.rootStore.select(fromRootState.getUserContext);
    this.loadingError$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyResourcesLoadingError);
    this.orphanedResources$ = this.store.select(fromCompanyResourcesPageReducer.getCompanyOrphanResources);
    this.resourceSuccess$ = this.store.select(fromCompanyResourcesPageReducer.getAddingCompanyResourceSuccess);

    this.store.dispatch(new fromCompanyResourcesPageActions.GettingCompanyResources());

    this.createSubscriptions();
  }

  ngOnDestroy() {
    this.indentitySubscription.unsubscribe();
    this.addingResourceSuccessSubscription.unsubscribe();
    this.addingFolderSuccessSubscription.unsubscribe();
    this.companyResourceUploadStateSubscription.unsubscribe();
  }

  openNewFolderModal() {
    this.modalService.open(NewFolderModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }

  openResourceModal() {
    this.modalService.open(ResourceModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    this.store.dispatch(new fromCompanyResourcesAddResourceActions.OpenAddResourceModal());
  }

  private createSubscriptions() {
    this.indentitySubscription = this.identity$.subscribe((response) => {
      this.companyName = response.CompanyName;
    });

    this.addingResourceSuccessSubscription = this.resourceSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
        this.store.dispatch(new fromCompanyResourcesAddResourceActions.ClearCompanyResourcesUploadState());
      }
    });

    this.addingFolderSuccessSubscription = this.folderSuccess$.subscribe((onSuccess) => {
      if (onSuccess) {
        this.modalService.dismissAll();
      }
    });

    this.companyResourceUploadStateSubscription = this.companyResourceUploadState$.subscribe((state) => {
        if (state) {
          this.companyResourceUploads = state.Resources;
        }
    });

    this.getNotificationSubscription = this.getNotification$.subscribe(notifications => {
      notifications.forEach(notification => {
        if (!notification) {
          return;
        }

        const resource = this.companyResourceUploads.find((x) => x.Id === notification.NotificationId);
        if (!resource) {
           return;
        }

        if (notification.Level === 'Success' && resource.Status !== KendoUploadStatus.ScanSucceeded) {
          this.store.dispatch(new fromCompanyResourcesAddResourceActions.CompanyResourceScanSuccess(resource.Id));
          this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
        } else if (notification.Level === 'Error' && resource.Status !== KendoUploadStatus.ScanFailed) {
          this.store.dispatch(new fromCompanyResourcesAddResourceActions.CompanyResourceScanFailure(resource.Id));
          this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
        }
      });
    });
  }
}
