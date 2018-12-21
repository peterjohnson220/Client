import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserAssignedRole } from 'libs/models/security';
import { PfValidators } from 'libs/forms/validators';

import { UserRoleValidationService } from '../../services';
import { ENTER_KEYCODE } from '../../constants/add-company-role-modal.constants';
import * as fromUserRoleViewReducer from '../../reducers';
import * as fromUserRoleActions from '../../actions/user-role-view.action';

@Component({
  selector: 'pf-add-company-role-modal',
  providers: [UserRoleValidationService],
  templateUrl: './add-company-role-modal.component.html',
  styleUrls: ['./add-company-role-modal.component.scss']
})
export class AddCompanyRoleModalComponent implements OnInit, OnDestroy {
  addCompanyRoleModalIsOpen$: Observable<boolean>;
  addCompanyRoleForm: FormGroup;
  AddCompanyRoleError: string;
  currentCompanyRoleName: string;
  addCompanyRoleModalIsOpenSubscription: Subscription;
  formValueChangesSubscription: Subscription;
  addCompanyRoleFormSubscription: Subscription;
  addCompanyRoleErrorSubscription: Subscription;
  @ViewChild('companyRoleName') companyRoleName: ElementRef;

  constructor(private store: Store<fromUserRoleViewReducer.State>,
              private formBuilder: FormBuilder,
              public validationService: UserRoleValidationService) {
    this.addCompanyRoleModalIsOpen$ = this.store.select(fromUserRoleViewReducer.getAddCompanyRoleModalIsOpen);

    this.addCompanyRoleFormSubscription = this.store.select(fromUserRoleViewReducer.getAddCompanyRoleForm).subscribe(addCompanyRoleForm => {
      if (addCompanyRoleForm) {
        this.currentCompanyRoleName = addCompanyRoleForm.CompanyRoleName;
      }

    });

    this.addCompanyRoleErrorSubscription = this.store.select(fromUserRoleViewReducer.getAddCompanyRoleError)
      .subscribe(addCompanyRoleError => {
        this.AddCompanyRoleError = addCompanyRoleError;
      });

    this.initForm();
  }

  ngOnInit() {
    this.formValueChangesSubscription = this.addCompanyRoleForm.valueChanges.subscribe(() => {
      this.store.dispatch(new fromUserRoleActions.FieldChange(this.addCompanyRoleForm.value));
    });
  }

  onAddCompanyRoleSubmit() {
    const newCompanyRole: UserAssignedRole = this.buildUserAssignedrole();
    this.store.dispatch(new fromUserRoleActions.AddCompanyRole(newCompanyRole));
  }

  onKeyDown(event) {
    if (event.keyCode === ENTER_KEYCODE && this.addCompanyRoleForm.valid) {
      this.onAddCompanyRoleSubmit();
    }
  }

  onAddCompanyRoleDismiss() {
    this.store.dispatch(new fromUserRoleActions.CloseAddCompanyRoleModal());
  }

  initForm() {
    const validator = this.validationService;
    this.addCompanyRoleForm = this.formBuilder.group({
      CompanyRoleName: [
        '',
        [
          PfValidators.required,
          Validators.minLength(validator.NAME_LENGTH.min),
          Validators.maxLength(validator.NAME_LENGTH.max),
          validator.validateSpecialChars
        ]
      ]
    });
  }

  onFieldBlur(formControlName: string) {
    // when a text field is blurred trim it's contents
    const formControl = this.addCompanyRoleForm.controls[formControlName];
    if (formControl && formControl.value) {
      formControl.setValue(formControl.value.trim());
    }
  }

  ngOnDestroy() {
    this.addCompanyRoleModalIsOpenSubscription.unsubscribe();
    this.formValueChangesSubscription.unsubscribe();
    this.addCompanyRoleFormSubscription.unsubscribe();
    this.addCompanyRoleErrorSubscription.unsubscribe();
  }

  private buildUserAssignedrole(): UserAssignedRole {
    return {
      DerivedId: 0,
      RoleName: this.currentCompanyRoleName,
      IsSystemRole: false,
      Assigned: false,
      Permissions: null
    };
  }
}
