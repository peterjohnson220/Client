import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompositeDataLoadTypes } from 'libs/constants/composite-data-load-types';
import { UserOrEmailPickerComponent } from 'libs/ui/common/user-email-picker/user-or-email-picker.component';

import { LoadTypes } from '../../../../constants';
import { ConfigurationGroup, EmailRecipientModel } from '../../../../models/data-loads';
import * as fromOrgDataEmailRecipientsActions from '../actions/email-recipients.actions';

@Component({
  selector: 'pf-email-recipients-modal',
  templateUrl: './email-recipients.component.html',
  styleUrls: ['./email-recipients.component.scss']
})
export class EmailRecipientsComponent implements OnInit {
  @Input() companyId: number;
  @Input() loaderConfigurationGroupId: number;
  @Input() recipients: EmailRecipientModel[];
  @Input() loadType: LoadTypes;
  @Input() primaryCompositeDataLoadType: string;
  @Input() savingError$: Observable<boolean>;
  @Input() removingError$: Observable<boolean>;
  @Input() emailRecipientsModalOpen$: Observable<boolean>;
  @ViewChild('userEmailPicker') userOrEmailPickerComponent: UserOrEmailPickerComponent;

  errorText: string;

  constructor(public store: Store<any>) {}

  ngOnInit() {
    this.savingError$.subscribe(res => {
      if (res) {
        this.errorText = 'Error saving recipient.';
      }
    });

    this.removingError$.subscribe(res => {
      if (res) {
        this.errorText = 'Error removing recipient.';
      }
    });
  }

  onRecipientSelected(recipient: EmailRecipientModel) {
    let configurationGroup: ConfigurationGroup;
    if (!this.loaderConfigurationGroupId) {
      configurationGroup = {
        LoaderConfigurationGroupId: null,
        CompanyId: this.companyId,
        GroupName: this.loadType === LoadTypes.Sftp ? 'Sftp Saved Mappings' : 'Saved Manual Mappings',
        LoadType: this.loadType,
        PrimaryCompositeDataLoadType: this.primaryCompositeDataLoadType
      };
    }
    this.errorText = '';
    recipient.CompanyId = this.companyId;
    recipient.LoaderConfigurationGroupId = this.loaderConfigurationGroupId;
    recipient.LoaderType = this.primaryCompositeDataLoadType === CompositeDataLoadTypes.OrgData ? 'Organizational Data' : this.primaryCompositeDataLoadType;
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.SavingEmailRecipient(recipient, configurationGroup));
  }

  clearRecipient(recipient: EmailRecipientModel) {
    this.errorText = '';
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.RemovingEmailRecipient(recipient));
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.CloseEmailRecipientsModal);
    this.userOrEmailPickerComponent.clearModel();
  }
}
