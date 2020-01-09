import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PlatformLocation} from '@angular/common';

import {FileInfo, FileRestrictions, SuccessEvent, UploadEvent} from '@progress/kendo-angular-upload';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import * as fromRootState from 'libs/state/state';
import {UserBulkAdd} from 'libs/models/admin/user-bulk-add.model';
import {PayfactorsApiService} from 'libs/data/payfactors-api/payfactors-api.service';

import {toggleStateAnimation} from '../../animations/toggle-animations';
import {BaseBulkAddUsersTogglePanelComponent} from '../base-bulk-add-users-toggle-panel';
import * as fromBulkAddUsersReducer from '../../reducers';
import {PanelState} from '../base-toggle-panel';
import * as fromUserBulkAddActions from '../../actions/user-bulk-add.action';
import {BaseUrlLocation} from '../../../../../../../libs/models/payfactors-api/common/base-url-location.enum';

@Component({
    selector: 'pf-bulk-add-users-loader-upload-panel',
    templateUrl: './bulk-add-users-loader-upload-panel.html',
    styleUrls: ['../bulk-add-users-loader-panel.css'],
    animations: [toggleStateAnimation],
})
export class BulkAddUsersLoaderUploadPanelComponent extends BaseBulkAddUsersTogglePanelComponent implements OnInit, OnDestroy {
  uploadUrl: string;
  myFiles: Array<FileInfo>;
  passwordRequirement: number;
  userWorksheet: string;
  excelRestrictions: FileRestrictions = {
      allowedExtensions: ['.xlsx']
  };

  storeFileNameInSessionSuccess$: Observable<any>;
  storeFileNameInSessionSuccessSubscription: Subscription;
  storeFileNameInSessionError$: Observable<boolean>;
  storeFileNameInSessionErrorSubscription: Subscription;

  storeAndMapBulkAddUsersInSessionSuccess$: Observable<any>;
  storeAndMapBulkAddUsersInSessionSuccessSubscription: Subscription;
  storeAndMapBulkAddUsersInSessionError$: Observable<boolean>;
  storeAndMapBulkAddUsersInSessionErrorSubscription: Subscription;

  getCompanyPasswordLengthSuccess$: Observable<number>;
  getCompanyPasswordLengthSuccessSubscription: Subscription;
  getCompanyPasswordLengthError$: Observable<boolean>;
  getCompanyPasswordLengthErrorSubscription: Subscription;

  userContextSubscription: Subscription;
  location: PlatformLocation;
  userBulkAdd: UserBulkAdd;
  apiService: PayfactorsApiService;

  @Input() companyId: number;

  constructor(store: Store<fromBulkAddUsersReducer.State>,
              private rootStore: Store<fromRootState.State>,
              location: PlatformLocation,
              apiService: PayfactorsApiService) {
    super(store);
    this.storeFileNameInSessionSuccess$ = this.store.select(fromBulkAddUsersReducer.getStoreFileNameInSessionSuccess);
    this.storeFileNameInSessionError$ = this.store.select(fromBulkAddUsersReducer.getStoreFileNameInSessionError);
    this.storeAndMapBulkAddUsersInSessionSuccess$ = this.store.select(fromBulkAddUsersReducer.getStoreAndMapBulkAddUsersInSessionSuccess);
    this.storeAndMapBulkAddUsersInSessionError$ = this.store.select(fromBulkAddUsersReducer.getStoreAndMapBulkAddUsersInSessionError);
    this.getCompanyPasswordLengthSuccess$ = this.store.select(fromBulkAddUsersReducer.getCompanyPasswordLengthSuccess);
    this.getCompanyPasswordLengthError$ = this.store.select(fromBulkAddUsersReducer.getCompanyPasswordLengthError);
    this.location = location;
    this.apiService = apiService;

  }

  ngOnInit() {
    super.ngOnInit();
    this.buildUploadUrl();
    this.storeFileNameInSessionSuccessSubscription = this.storeFileNameInSessionSuccess$
      .subscribe(response => {
        if (response) {
          this.userBulkAdd = new UserBulkAdd(this.companyId, this.userWorksheet);
          this.store.dispatch(new fromUserBulkAddActions.StoreAndMapBulkAddUsersInSession(this.userBulkAdd));
        }
      });


    this.storeFileNameInSessionErrorSubscription = this.storeFileNameInSessionError$
      .subscribe(response => {
        if (response) {
          this.errorFound();
        }
      });


    this.storeAndMapBulkAddUsersInSessionSuccessSubscription = this.storeAndMapBulkAddUsersInSessionSuccess$
      .subscribe(response => {
        if (response) {
          if (response && JSON.stringify(response) !== '{}') {
            this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderImportValidation());
          } else {
            this.errorFound();
          }
        }
      });


    this.storeAndMapBulkAddUsersInSessionErrorSubscription = this.storeAndMapBulkAddUsersInSessionError$
      .subscribe(response => {
        if (response) {
          this.errorFound();
        }
      });

    this.getCompanyPasswordLengthSuccessSubscription = this.getCompanyPasswordLengthSuccess$
      .subscribe(response => {
        if (response) {
          this.passwordRequirement = response;
        }
      });

    this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderUploadPanel());
    this.store.dispatch(new fromUserBulkAddActions.GetCompanyPasswordLength());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resetSubscriptions();
  }

  init() {
    this.resetPanelState();
    this.resetFileList();
  }

  private resetFileList() {
    this.myFiles = [];
  }

  private resetSubscriptions() {
    this.storeAndMapBulkAddUsersInSessionSuccessSubscription.unsubscribe();
    this.storeAndMapBulkAddUsersInSessionErrorSubscription.unsubscribe();
    this.storeFileNameInSessionSuccessSubscription.unsubscribe();
    this.storeFileNameInSessionErrorSubscription.unsubscribe();
    this.getCompanyPasswordLengthSuccessSubscription.unsubscribe();
  }

  errorEventHandler(e: ErrorEvent) {
    this.errorFound();
  }

  uploadEventHandler($event: UploadEvent) {

  }

  successEventHandler($event: SuccessEvent) {
    this.processWorksheetData($event.response.body);
  }

  private reupload() {
    this.init();
    this.store.dispatch(new fromUserBulkAddActions.ResetAll());
    this.store.dispatch(new fromUserBulkAddActions.ShowBulkAddUsersLoaderUploadPanel());
  }

  private processWorksheetData(worksheetUploadResult: any) {
    if (worksheetUploadResult && worksheetUploadResult.WorksheetNames.length > 0) {
        this.userWorksheet = worksheetUploadResult.WorksheetNames[0];
    } else {
        this.errorFound();
        return;
    }

    this.store.dispatch(new fromUserBulkAddActions.StoreWorksheetNames(worksheetUploadResult.WorksheetNames));
    this.store.dispatch(new fromUserBulkAddActions.StoreFileNameInSession(worksheetUploadResult.FileName));
  }

  private errorFound() {
    this.panelState = PanelState.Error;
  }

  private buildUploadUrl() {
    this.uploadUrl = this.apiService.formatUrl(BaseUrlLocation.FrontEnd, 'Upload/Upload', true);
  }

}
