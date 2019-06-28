import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/index';

import { LoaderTypes } from 'libs/constants/loader-types';

import * as fromOrgDataLoaderReducer from '../../reducers';
import * as fromOrgDataEmailRecipientsActions from '../../actions/email-recipients.actions';
import { EmailRecipientModel } from '../../models/email-recipient.model';

@Component({
  selector: 'pf-email-recipients-modal',
  templateUrl: './email-recipients.component.html',
  styleUrls: ['./email-recipients.component.scss']
})
export class EmailRecipientsComponent implements OnInit {
  @Input() companyId: number;
  @Input() recipients: EmailRecipientModel[];

  errorText: string;
  savingError$: Observable<boolean>;
  removingError$: Observable<boolean>;
  emailRecipientsModalOpen$: Observable<boolean>;

  constructor(public store: Store<fromOrgDataLoaderReducer.State>) {

    this.savingError$ = this.store.select(fromOrgDataLoaderReducer.getSavingRecipientError);
    this.removingError$ = this.store.select(fromOrgDataLoaderReducer.getRemovingRecipientError);
    this.emailRecipientsModalOpen$ = this.store.select(fromOrgDataLoaderReducer.getEmailRecipientsModalOpen);
  }

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
    this.errorText = '';
    recipient.CompanyId = this.companyId;
    recipient.LoaderType = LoaderTypes.OrgData;
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.SavingEmailRecipient(recipient));
  }

  clearRecipient(recipient: EmailRecipientModel) {
    this.errorText = '';
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.RemovingEmailRecipient(recipient));
  }

  handleModalDismissed(): void {
    this.store.dispatch(new fromOrgDataEmailRecipientsActions.CloseEmailRecipientsModal);
  }
}
