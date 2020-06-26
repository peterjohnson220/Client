import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityAttachmentWarningActions from '../../actions/community-attachment-warning.actions';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';
import { FeatureAreaConstants, SaveUiPersistenceSettingRequest, UiPersistenceSettingConstants } from 'libs/models/common';


@Component({
  selector: 'pf-community-attachment-warning-modal',
  templateUrl: './community-attachment-warning-modal.component.html',
  styleUrls: [ './community-attachment-warning-modal.component.scss' ]
})

export class CommunityAttachmentWarningModalComponent implements OnInit {
  currentAttachmentWarningModalOpen$: Observable<boolean>;
  currentAttachmentDownloadUrl$: Observable<string>;
  savingSettingSuccess$: Observable<boolean>;
  savingSettingName$: Observable<string>;
  dismissAttachmentWarning = false;
  attachmentDownloadUrl: string;
  savingSettingName: string;

  constructor(public store: Store<fromCommunityReducers.State>) {
    this.currentAttachmentWarningModalOpen$ = this.store.select(fromCommunityReducers.getCurrentAttachmentWarningModalState);
    this.currentAttachmentDownloadUrl$ = this.store.select(fromCommunityReducers.getCurrentAttachmentDownloadUrl);
    this.savingSettingName$ = this.store.select(fromRootState.getUiPersistenceLastAttemptedSaveSettingName);
    this.savingSettingSuccess$ = this.store.select(fromRootState.getUiPersistenceSettingsSavingSuccess);

    this.savingSettingName$.subscribe(name => {
      this.savingSettingName = name;
    });

    this.savingSettingSuccess$.subscribe(savingSettingSuccess => {
      if (savingSettingSuccess && (this.savingSettingName === UiPersistenceSettingConstants.CommunityHideAttachmentWarningModal)) {
        this.store.dispatch(new fromCommunityAttachmentWarningActions.CloseCommunityAttachmentsWarningModal());
        window.location.href = this.attachmentDownloadUrl;
      }
    });
  }

  ngOnInit() {
    this.currentAttachmentDownloadUrl$.subscribe((response) => {
      if (response) {
        this.attachmentDownloadUrl = response;
      }
    });
  }

  handleModalSubmit() {
    this.store.dispatch(new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
      FeatureArea: FeatureAreaConstants.Community,
      SettingName: UiPersistenceSettingConstants.CommunityHideAttachmentWarningModal,
      SettingValue: this.dismissAttachmentWarning.toString()
    } as SaveUiPersistenceSettingRequest));
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCommunityAttachmentWarningActions.CloseCommunityAttachmentsWarningModal());
    this.dismissAttachmentWarning = false;
  }
}
