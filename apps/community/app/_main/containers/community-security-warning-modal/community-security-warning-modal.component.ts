import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityFileDownloadSecurityWarningActions from '../../actions/community-file-download-security-warning.actions';
import * as fromCommunityPollResponseActions from '../../actions/community-poll-response.actions';

import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common/file-download-security-warning';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { DownloadTypeEnum } from '../../models/download-type.enum';

@Component({
  selector: 'pf-community-security-warning-modal',
  templateUrl: './community-security-warning-modal.component.html',
  styleUrls: [ './community-security-warning-modal.component.scss' ]
})

export class CommunitySecurityWarningModalComponent implements OnInit, OnDestroy {
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  fileDownloadSecurityWarningModal_Open$: Observable<boolean>;
  fileDownloadSecurityWarningModal_DownloadId$: Observable<string>;
  fileDownloadSecurityWarningModal_DownloadType$: Observable<string>;
  showFileDownloadSecurityWarning$: Observable<boolean>;

  fileDownloadSecurityWarningModal_OpenSubscription: Subscription;
  fileDownloadSecurityWarningModal_DownloadIdSubscription: Subscription;
  fileDownloadSecurityWarningModal_DownloadTypeSubscription: Subscription;
  showFileDownloadSecurityWarningSubscription: Subscription;

  fileDownloadSecurityWarningModal_DownloadId: string;
  fileDownloadSecurityWarningModal_DownloadType: string;
  showFileDownloadSecurityWarning: boolean;

  constructor(public store: Store<fromCommunityReducers.State>, private settingService: SettingsService) {
    this.fileDownloadSecurityWarningModal_Open$ = this.store.select(fromCommunityReducers.getCurrentFileDownloadSecurityWarningModalState);
    this.fileDownloadSecurityWarningModal_DownloadId$ = this.store.select(fromCommunityReducers.getCurrentFileDownloadSecurityWarningDownloadId);
    this.fileDownloadSecurityWarningModal_DownloadType$ = this.store.select(fromCommunityReducers.getCurrentFileDownloadSecurityWarningDownloadType);
    this.showFileDownloadSecurityWarning$ = this.settingService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.fileDownloadSecurityWarningModal_OpenSubscription = this.fileDownloadSecurityWarningModal_Open$.subscribe(isOpen => {
      if (isOpen === true) {
        this.fileDownloadSecurityWarningModal.open();
      }
    });

    this.fileDownloadSecurityWarningModal_DownloadIdSubscription = this.fileDownloadSecurityWarningModal_DownloadId$.subscribe(downloadId => {
      if (downloadId) {
        this.fileDownloadSecurityWarningModal_DownloadId = downloadId;
      }
    });

    this.fileDownloadSecurityWarningModal_DownloadTypeSubscription = this.fileDownloadSecurityWarningModal_DownloadType$.subscribe(downloadType => {
      if (downloadType) {
        this.fileDownloadSecurityWarningModal_DownloadType = downloadType;
      }
    });

    this.showFileDownloadSecurityWarningSubscription = this.showFileDownloadSecurityWarning$.subscribe(value => {
      if (value != null) {
        this.showFileDownloadSecurityWarning = value;
      }
    });
  }

  ngOnDestroy() {
    if (this.fileDownloadSecurityWarningModal_OpenSubscription) {
      this.fileDownloadSecurityWarningModal_OpenSubscription.unsubscribe();
    }

    if (this.fileDownloadSecurityWarningModal_DownloadIdSubscription) {
      this.fileDownloadSecurityWarningModal_DownloadIdSubscription.unsubscribe();
    }

    if (this.fileDownloadSecurityWarningModal_DownloadTypeSubscription) {
      this.fileDownloadSecurityWarningModal_DownloadTypeSubscription.unsubscribe();
    }

    if (this.showFileDownloadSecurityWarningSubscription) {
      this.showFileDownloadSecurityWarningSubscription.unsubscribe();
    }
  }

    handleSecurityWarningConfirmed(isConfirmed) {
      if (isConfirmed) {
        switch (this.fileDownloadSecurityWarningModal_DownloadType) {
          case DownloadTypeEnum.CommunityUserPollExport: {
            this.store.dispatch(new fromCommunityPollResponseActions.ExportingCommunityUserPollResponses(this.fileDownloadSecurityWarningModal_DownloadId));
            break;
          }
          case DownloadTypeEnum.CommunityAttachment: {
            window.location.href = this.fileDownloadSecurityWarningModal_DownloadId;
            break;
          }
        }
      }
      this.store.dispatch(new fromCommunityFileDownloadSecurityWarningActions.CloseCommunityFileDownloadSecurityWarningModal());
    }

    handleSecurityWarningCancelled() {
      this.store.dispatch(new fromCommunityFileDownloadSecurityWarningActions.CloseCommunityFileDownloadSecurityWarningModal());
    }
}
