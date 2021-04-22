import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';

import * as fromServiceAccountActions from 'libs/features/service-accounts/actions';
import * as fromServiceAccountReducer from 'libs/features/service-accounts/reducers';
import { ServiceAccountReportClass } from 'libs/constants/service-accounts';
import { ServiceAccountUser, ServiceAccountUserStatus } from 'libs/models/service-accounts';


@Component({
  selector: 'pf-reset-credentials-modal',
  templateUrl: './reset-credentials-modal.component.html',
  styleUrls: ['./reset-credentials-modal.component.scss']
})
export class ResetCredentialsModalComponent implements OnInit {
  isChecked: boolean;

  showResetAccountModal$: Observable<boolean>;
  showNewServiceAccountModal$: Observable<boolean>;
  serviceAccountUser$: Observable<ServiceAccountUser>;
  serviceAccountStatus$: Observable<ServiceAccountUserStatus>;
  serviceAccountStatus: ServiceAccountUserStatus;

  constructor(private serviceAccountStore: Store<fromServiceAccountReducer.State>) {
    this.showResetAccountModal$ = this.serviceAccountStore.select(fromServiceAccountReducer.getShowServiceAccountModal);
    this.showNewServiceAccountModal$ = this.serviceAccountStore.select(fromServiceAccountReducer.getShowNewServiceAccountModal);
    this.serviceAccountStatus$ = this.serviceAccountStore.select(fromServiceAccountReducer.getAccountStatus);
    this.serviceAccountUser$ = this.serviceAccountStore.select(fromServiceAccountReducer.getServiceAccountUser);
  }

  ngOnInit() {
    this.isChecked = false;
  }

  resetCredentials() {
    this.serviceAccountStore.dispatch(new fromServiceAccountActions.ResetServiceAccount({
      Purpose: 'Resetting Account for JDM Export Api',
      ReportClass: ServiceAccountReportClass.HrisOutboundJobs,
    }));

    this.serviceAccountStore.dispatch(new fromServiceAccountActions.CloseResetAccountModal());
    this.serviceAccountStore.dispatch(new fromServiceAccountActions.OpenNewAccountModal());
  }

  handleResetAccountModalDismiss() {
    this.serviceAccountStore.dispatch(new fromServiceAccountActions.CloseResetAccountModal());
    this.isChecked = false;
  }

  handleNewAccountModalDismiss() {
    this.serviceAccountStore.dispatch(new fromServiceAccountActions.CloseNewAccountModal());
    this.isChecked = false;
  }
}
