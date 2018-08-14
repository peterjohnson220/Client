import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserContext } from 'libs/models/security';
import { CompanySettingDto } from 'libs/models/company';
import * as fromRootState from 'libs/state/state';
import * as fromUserContextActions from 'libs/state/app-context/actions/user-context.actions';
import * as fromCompanySettingsActions from 'libs/state/app-context/actions/company-settings.actions';

import * as fromFirstLoginReducer from '../../../reducers';
import * as fromFirstLoginActions from '../../../actions/first-login.action';

@Component({
  selector: 'pf-first-login-page',
  templateUrl: './first-login.page.html',
  styleUrls: [ './first-login.page.scss' ]
})
export class FirstLoginPageComponent implements OnInit {
  userContext$: Observable<UserContext>;
  userContextLoading$: Observable<boolean>;
  userContextAttempted$: Observable<boolean>;
  validatingFirstLogin$: Observable<boolean>;
  validatingFirstLoginSuccess$: Observable<boolean>;
  updatingPasswordError$: Observable<boolean>;
  companySettings$: Observable<CompanySettingDto[]>;
  companySettingsLoading$: Observable<boolean>;
  companySettingAttempted$: Observable<boolean>;
  loadingUserContext: boolean;
  loadingCompanySettings: boolean;
  isValidating: boolean;
  isFirstLogin: boolean;
  submitEnabled: boolean;
  formIsValid: boolean;
  updateError: boolean;
  password: string;
  passwordLengthReq: string;

  constructor(public store: Store<fromFirstLoginReducer.State>) {
    this.userContext$ = store.select(fromRootState.getUserContext);
    this.userContextLoading$ = this.store.select(fromRootState.getGettingUserContext);
    this.userContextAttempted$ = store.select(fromRootState.getGettingUserContextAttempted);
    this.validatingFirstLogin$ = store.select(fromFirstLoginReducer.getValidatingFirstLogin);
    this.validatingFirstLoginSuccess$ = store.select(fromFirstLoginReducer.getValidatingFirstLoginSuccess);
    this.updatingPasswordError$ = store.select(fromFirstLoginReducer.getFirstLoginUpdatingPasswordError);
    this.companySettings$ = store.select(fromRootState.getCompanySettings);
    this.companySettingsLoading$ = store.select(fromRootState.getGettingCompanySettings);
    this.companySettingAttempted$ = store.select(fromRootState.getGettingCompanySettingsAttempted);
    this.loadingUserContext = false;
    this.loadingCompanySettings = false;
    this.isValidating = false;
    this.isFirstLogin = false;
    this.submitEnabled = false;
    this.formIsValid = false;
  }

  ngOnInit(): void {
    // User Context subscriptions
    this.store.dispatch(new fromUserContextActions.GetUserContext());

    this.userContextLoading$.subscribe( loading => {
      this.loadingUserContext = loading;
    });

    this.userContextAttempted$.subscribe( attempted => {
      if (attempted !== undefined && attempted) {
        this.store.dispatch(new fromFirstLoginActions.ValidateFirstLogin());
      }
    });

    // Company Settings subscriptions
    this.store.dispatch(new fromCompanySettingsActions.GetCompanySettings());

    this.companySettingsLoading$.subscribe(loading => {
      this.loadingCompanySettings = loading;
    });

    this.companySettingAttempted$.subscribe(attempted => {
      if (attempted !== undefined && attempted) {
        this.companySettings$.subscribe(payload => {
          this.passwordLengthReq = payload.find(function (el) {
            return el.Name === 'PasswordLengthRequirement';
          }).Value;
        });
      }
    });

    // First Time Validation Subscriptions
    this.validatingFirstLogin$.subscribe( isValidating => {
      this.isValidating = isValidating;
    });

    this.validatingFirstLoginSuccess$.subscribe( success => {
      this.isFirstLogin = success;
    });

    // Update Password subscriptions
    this.updatingPasswordError$.subscribe(isError => {
      this.updateError = isError;
    });
  }

  passwordValid(password: string) {
    this.password = password;
    this.formIsValid = true;
    this.submitEnabled = true;
    this.updateError = false;
  }

  invalid() {
    this.formIsValid = false;
    this.submitEnabled = false;
    this.updateError = false;
  }

  updatePassword() {
    if (this.password !== undefined) {
      this.submitEnabled = false;
      this.store.dispatch(new fromFirstLoginActions.UpdatePassword(this.password));
    }
  }
}
