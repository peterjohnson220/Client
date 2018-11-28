import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromSelfRegistrationReducer from '../../../reducers';
import * as fromSelfRegistrationActions from '../../../actions/self-registration.actions';
import { SelfRegistrationExistingCompany } from '../../../models/self-registration-existing-company.model';

@Component({
  selector: 'pf-self-registration-page',
  templateUrl: './self-registration.page.html',
  styleUrls: [ './self-registration.page.scss' ]
})
export class SelfRegistrationPageComponent implements OnInit {
  validatingToken$: Observable<boolean>;
  validatingTokenError$: Observable<boolean>;
  validatingTokenExpired$: Observable<boolean>;
  validatingTokenSuccess$: Observable<boolean>;
  validatingTokenAccountExists$: Observable<boolean>;
  validatingTokenExistingCompany$: Observable<SelfRegistrationExistingCompany>;
  accountEmail$: Observable<string>;
  submitError$: Observable<boolean>;
  isSubmitting$: Observable<boolean>;
  password: string;
  submitEnabled: boolean;
  token: string;

  constructor(
    private store: Store<fromSelfRegistrationReducer.State>,
    private route: ActivatedRoute
  ) {
    this.validatingToken$ = store.select(fromSelfRegistrationReducer.getValidatingToken);
    this.validatingTokenError$ = store.select(fromSelfRegistrationReducer.getValidatingTokenError);
    this.validatingTokenExpired$ = store.select(fromSelfRegistrationReducer.getValidatingTokenExpired);
    this.validatingTokenSuccess$ = store.select(fromSelfRegistrationReducer.getValidatingTokenSuccess);
    this.validatingTokenAccountExists$ = store.select(fromSelfRegistrationReducer.getValidatingTokenAccountExists);
    this.accountEmail$ = store.select(fromSelfRegistrationReducer.getAccountEmail);
    this.validatingTokenExistingCompany$ = store.select(fromSelfRegistrationReducer.getValidatingTokenExistingCompany);
    this.isSubmitting$ = store.select(fromSelfRegistrationReducer.getSelfRegistrationCompletionIsSubmitting);
    this.submitError$ = store.select(fromSelfRegistrationReducer.getSelfRegistrationCompletionSubmitError);
    this.submitEnabled = false;
  }

  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.token = queryParamMap.get('tk');
    this.store.dispatch(new fromSelfRegistrationActions.ValidateToken({ token: this.token }));
  }

  passwordValid(password: string) {
    this.password = password;
    this.submitEnabled = true;
  }

  passwordInvalid() {
    this.submitEnabled = false;
  }

  updatePassword() {
    if (this.password != null && typeof(this.password) !== 'undefined') {
      this.submitEnabled = false;

      const formPayload = { Token: this.token, Password: this.password };
      this.store.dispatch(new fromSelfRegistrationActions.CompletionSubmit(formPayload));
    }
  }

}
