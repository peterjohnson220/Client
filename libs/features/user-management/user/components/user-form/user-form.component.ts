  import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { PfValidators, PfEmailValidators, PfEmailTakenValidator, ValidationRules } from 'libs/forms';
import { GenericMenuItem, SubsidiaryInfo, UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { UserApiService } from 'libs/data/payfactors-api';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Field } from '../../../../../../apps/data-insights/app/_data-view/models';
import { PfPasswordValidators } from 'libs/forms/validators/pf-password-validators';

@Component({
  selector: 'pf-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy {
  readonly MAX_NAME_LENGTH = 50;
  readonly MAX_EMAIL_LENGTH = 100;
  readonly MAX_TITLE_LENGTH = 255;

  readonly MIN_PASSWORD_LENGTH = 8;
  readonly MAX_PASSWORD_LENGTH = 255;
  readonly PASSWORD_ALLOW_SPACES = false;
  readonly PASSWORD_UPPER_CASE_CHARS = 1;
  readonly PASSWORD_LOWER_CASE_CHARS = 1;
  readonly PASSWORD_SPECIAL_CHARS = 1;
  readonly PASSWORD_NUMERIC_CHARS = 1;

  readonly DEFAULT_USER_ROLE = 2;
  readonly DEFAULT_STATUS = true;

  showUserRoleModal = new BehaviorSubject<boolean>(false);
  showUserRoleModal$ = this.showUserRoleModal.asObservable();

  userForm: FormGroup;

  newUser: UserManagementDto = {
    UserId: null,
    CompanyId: null,
    FirstName: null,
    LastName: null,
    EmailAddress: null,
    Password: null,
    Title: null,
    Active: true,
    PhoneNumber: null,
    LastLogin: null,
    SsoId: null,
    SendWelcomeEmail: null,
    RoleId: null,
    UserSubsidiaryIds: []
  };
  user: UserManagementDto = this.newUser;

  companySubsidiaries: GenericMenuItem[] = [];
  selectedValues: string[] = [];

  passwordValidationRules: any[];
  passwordFocused = false;
  private _showPassword = false;
  get showPassword(): boolean {
    return this._showPassword;
  }
  set showPassword(value: boolean) {
    this._showPassword = value;
    this.f.password.patchValue('');
    this.f.sendWelcomeEmail.patchValue(!value);
    this.setPasswordValidator(this._showPassword);
  }

  @Input() companySubsidiaries$: Observable<SubsidiaryInfo[]>;
  @Input() user$: Observable<UserManagementDto>;

  @Input() userId: number;
  @Input() companyId: number;
  @Input() userRoles: UserAssignedRole[];

  @Output() saveUser = new EventEmitter();

  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private userApiService: UserApiService,
    private modalService: NgbModal
  ) {

    this.userForm = formBuilder.group({
      firstName: ['', [PfValidators.required, Validators.maxLength(this.MAX_NAME_LENGTH)]],
      lastName: ['', [PfValidators.required, Validators.maxLength(this.MAX_NAME_LENGTH)]],
      title: ['', Validators.maxLength(this.MAX_TITLE_LENGTH)],
      status: [this.DEFAULT_STATUS, Validators.required],
      phoneNumber: ['', Validators.maxLength(this.MAX_NAME_LENGTH)],
      emailAddress: ['', [
        PfValidators.required,
        Validators.maxLength(this.MAX_EMAIL_LENGTH),
        PfEmailValidators.emailFormat,
      ], PfEmailTakenValidator.createValidator(this.userApiService)],
      ssoId: ['', Validators.maxLength(this.MAX_NAME_LENGTH)],
      userRole: [this.DEFAULT_USER_ROLE, Validators.required],
      password: '',
      sendWelcomeEmail: true,
    });

    this.showPassword = true;
  }

  ngOnInit() {
    this.setupUserAndSubsidiaries();
  }

  ngOnDestroy() {
  }

  populateForm(user: UserManagementDto) {
    this.userForm.patchValue({
      firstName: user.FirstName,
      lastName: user.LastName,
      title: user.Title,
      status: user.Active,
      phoneNumber: user.PhoneNumber,
      emailAddress: user.EmailAddress,
      ssoId: user.SsoId,
      userRole: user.RoleId
    });
  }

  setPasswordValidator(value: boolean) {
    if (value && this.f.status.value.toString() === 'true') {
      this.updatePasswordRules();
      const passwordValidators = [PfValidators.required];
      for (const validationRule of this.passwordValidationRules) {
          passwordValidators.push(validationRule.Validator ? validationRule.Validator(validationRule)
        : Validators.pattern(new RegExp(validationRule.Rule)));
      }
      this.f.password.setValidators(passwordValidators);
    } else {
      this.f.password.setValidators(null);
    }
    this.f.password.updateValueAndValidity();
  }

  setEmailExistsValidator(value: string) {
    this.f.emailAddress.setAsyncValidators(PfEmailTakenValidator.createValidator(this.userApiService, value));
    this.f.emailAddress.updateValueAndValidity();
  }

  onSave() {
    this.userForm.markAllAsTouched();

    if (this.userForm.valid) {
      const userToSave = this.generateUserToSave();
      this.saveUser.emit(userToSave);
    }
  }

  generateUserToSave() {
    const password = this.getPassword();

    return {
      ...this.user,
      CompanyId: this.user.UserId ? this.user.CompanyId : this.companyId,
      FirstName: this.f.firstName.value,
      LastName: this.f.lastName.value,
      Title: this.f.title.value,
      Active: this.f.status.value,
      PhoneNumber: this.f.phoneNumber.value,
      EmailAddress: this.f.emailAddress.value,
      SsoId: this.f.ssoId.value,
      RoleId: this.f.userRole.value,
      Password: password,
      SendWelcomeEmail: this.f.sendWelcomeEmail.value,
      UserSubsidiaryIds: this.selectedValues
    };
  }

  getPassword() {
    if (this.user.LastLogin) {
      return null;
    } else {
      return this.f.password.value;
    }
  }

  // TODO: move random string for new password to server-side code
  generateRandomPassword() {
    let randomString = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < this.MIN_PASSWORD_LENGTH; i++) {
      randomString += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomString;
  }

  setupUserAndSubsidiaries() {
    if (this.userId) {
      forkJoin([this.getUserLoaded(), this.getCompanySubsidiariesLoaded()])
        .subscribe(([user, companySubsidiaries]) => {
          this.setupUser(user);
          this.setupSubsidiariesMultiSelect(companySubsidiaries, user);
        });
    } else {
      this.getCompanySubsidiariesLoaded().subscribe((companySubsidiaries) => {
        this.setupSubsidiariesMultiSelect(companySubsidiaries, this.user);
      });
    }
  }

  getUserLoaded(): Observable<UserManagementDto> {
    return this.user$.pipe(
      filter(f => !!f),
      take(1)
    );
  }

  getCompanySubsidiariesLoaded(): Observable<SubsidiaryInfo[]> {
    return this.companySubsidiaries$.pipe(
      filter(l => !!l),
      take(1)
    );
  }

  setupUser(value: UserManagementDto) {
    if (value) {
      this.user = value;
      this.populateForm(this.user);
      this.showPassword = !this.user.LastLogin;
      this.setEmailExistsValidator(this.user.EmailAddress);
    }
  }

  setupSubsidiariesMultiSelect(companySubsidiaries: SubsidiaryInfo[], user: UserManagementDto) {
    companySubsidiaries.forEach(x => {
      const subsidiaryIdStr = x.SubsidiaryId.toString();
      const isSelected = user.UserSubsidiaryIds.includes(subsidiaryIdStr);
      const genericMenuItem = {DisplayName: x.SubsidiaryName, Value: subsidiaryIdStr, IsSelected: isSelected};
      this.companySubsidiaries.push(genericMenuItem);
      if (isSelected) {
        this.selectedValues.push(subsidiaryIdStr);
      }
    });
  }

  changeRole() {
    this.userForm.patchValue(this.userForm.value);
    this.showUserRoleModal.next(false);
  }

  changeStatus() {
    setTimeout(() => {
      if (!this.user.Active && this.userForm.value.status === 'true') {
        this.showUserRoleModal.next(true);
      }
    });
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

  validatePassword() {
    for (const validationRule of this.passwordValidationRules) {
      if (validationRule.Name === 'Contains Username') {
        // case insesitive comparison
        validationRule.IsSatisfied = new RegExp(validationRule.Rule).test(this.f.password.value.toLowerCase());
      } else {
        validationRule.IsSatisfied = new RegExp(validationRule.Rule).test(this.f.password.value);
      }
    }
  }

  updatePasswordRules() {
    // Dynamically create password validators
    this.passwordValidationRules = PfPasswordValidators.getPasswordValidationRules(
    this.MIN_PASSWORD_LENGTH,
    this.PASSWORD_ALLOW_SPACES,
    this.PASSWORD_UPPER_CASE_CHARS,
    this.PASSWORD_LOWER_CASE_CHARS,
    this.PASSWORD_SPECIAL_CHARS,
    this.PASSWORD_NUMERIC_CHARS,
    this.userForm.controls['emailAddress']?.value?.split('@')[0].toLowerCase());

    this.validatePassword();
  }

  setPasswordFocus() {
    this.passwordFocused = true;
  }

}
