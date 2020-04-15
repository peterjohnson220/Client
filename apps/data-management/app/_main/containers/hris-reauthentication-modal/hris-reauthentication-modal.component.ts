import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms';

import * as fromHrisConnectionActions from '../../actions/hris-connection.actions';
import * as fromDataManagementMainReducer from '../../reducers';

@Component({
  selector: 'pf-hris-reauthentication-modal',
  templateUrl: './hris-reauthentication-modal.component.html',
  styleUrls: ['./hris-reauthentication-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HrisReAuthenticationModalComponent implements OnDestroy {
  hrisReAuthenticateForm: FormGroup;
  attemptedSubmit = false;
  submitted = false;

  hrisReAuthenticateFormOpen$: Observable<boolean>;
  hrisAuthFormSaving$: Observable<boolean>;
  hrisAuthFormErrors$: Observable<string[]>;

  selectedProviderSub: Subscription;

  private userNameValidtors = [PfValidators.required];

  constructor(private store: Store<fromDataManagementMainReducer.State>, private fb: FormBuilder) {
    this.hrisReAuthenticateFormOpen$ = this.store.select(fromDataManagementMainReducer.getHrisReauthenticationModalOpen);
    this.hrisAuthFormSaving$ = this.store.select(fromDataManagementMainReducer.getHrisActiveConnectionSaving);
    this.hrisAuthFormErrors$ = this.store.select(fromDataManagementMainReducer.getValidationErrors);
    this.selectedProviderSub = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary).subscribe(v => {
      if (v && v.provider) {
        switch (v.provider.ProviderCode) {
          case 'WDMOCK':
          case 'PFTEST':
          case 'WORKDAY': {
            this.userNameValidtors.push(Validators.pattern(/^\S+@\S+$/));
            this.hrisReAuthenticateForm.controls.username.setValidators(this.userNameValidtors);
            this.hrisReAuthenticateForm.controls.username.updateValueAndValidity();
            break;
          }
          case 'WDREST':
          default:
            break;
        }
      }
    });
    this.initForm();
  }

  ngOnDestroy() {
    this.selectedProviderSub.unsubscribe();
  }

  initForm(): void {
    this.hrisReAuthenticateForm = this.fb.group({
      'username': ['', this.userNameValidtors],
      'password': ['', [PfValidators.required]]
    });
  }

  handleModalDismissed() {
    this.attemptedSubmit = false;
    this.submitted = false;
    this.store.dispatch(new fromHrisConnectionActions.OpenReAuthenticationModal(false));
  }

  handleFormSubmit() {
    this.submitted = true;
    this.store.dispatch(new fromHrisConnectionActions.PatchConnection(this.hrisReAuthenticateForm.value));
  }

  handleFormSubmitAttempt() {
    this.attemptedSubmit = true;
    if (this.hrisReAuthenticateForm.invalid) {
      return;
    }
  }
}
