import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromCommunityReducers from '../../reducers';
import * as fromCommunityAttachmentWarningActions from '../../actions/community-attachment-warning.actions';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

@Component({
  selector: 'pf-community-attachment-warning-modal',
  templateUrl: './community-attachment-warning-modal.component.html',
  styleUrls: [ './community-attachment-warning-modal.component.scss' ]
})
export class CommunityAttachmentWarningModalComponent implements OnInit {
  currentAttachmentWarningModalOpen$: Observable<boolean>;
  currentAttachmentDownloadUrl$: Observable<string>;
  dismissAttachmentWarning = false;
  attachmentDownloadUrl: string;

  constructor(public store: Store<fromCommunityReducers.State>,
              public settingService: SettingsService) {
    this.currentAttachmentWarningModalOpen$ = this.store.select(fromCommunityReducers.getCurrentAttachmentWarningModalState);
    this.currentAttachmentDownloadUrl$ = this.store.select(fromCommunityReducers.getCurrentAttachmentDownloadUrl);
  }

  ngOnInit() {
    this.currentAttachmentDownloadUrl$.subscribe((response) => {
      if (response) {
        this.attachmentDownloadUrl = response;
      }
    });
  }

  handleModalSubmit() {
    this.settingService.updateUiPersistenceSettingValue(
      FeatureAreaConstants.Community,
      UiPersistenceSettingConstants.CommunityHideAttachmentWarningModal,
      this.dismissAttachmentWarning.toString()
    );

    this.store.dispatch(new fromCommunityAttachmentWarningActions.CloseCommunityAttachmentsWarningModal());
    window.location.href = this.attachmentDownloadUrl;
  }

  handleModalDismissed() {
    this.store.dispatch(new fromCommunityAttachmentWarningActions.CloseCommunityAttachmentsWarningModal());
  }
}
