import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { forkJoin, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ISubscription } from 'rxjs/Subscription';

import { PfValidators, PfEmailValidators, PfEmailTakenValidator } from 'libs/forms';
import { GenericMenuItem, SubsidiaryInfo, UserAssignedRole } from 'libs/models';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { UserApiService } from 'libs/data/payfactors-api';

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

  readonly DEFAULT_USER_ROLE = 2;
  readonly DEFAULT_STATUS = true;

  private passwordValidatorSubscription: ISubscription;

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
    private userApiService: UserApiService
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
    this.passwordValidatorSubscription = this.userForm.valueChanges.distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)).subscribe( _ => {
      if (!this.showPassword || (this.f.password.value === '' && this.f.status.value.toString() === 'false' && this.showPassword)) {
        this.f.password.setValidators(null);
      } else {
        this.f.password.setValidators([
          Validators.compose([
            PfValidators.required,
            Validators.minLength(this.MIN_PASSWORD_LENGTH),
            Validators.maxLength(this.MAX_PASSWORD_LENGTH)
          ])
        ]);
      }
      this.f.password.updateValueAndValidity();
    });

    this.setupUserAndSubsidiaries();
  }

  ngOnDestroy() {
    this.passwordValidatorSubscription.unsubscribe();
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
      this.f.password.setValidators([
        Validators.compose([
          PfValidators.required,
          Validators.minLength(this.MIN_PASSWORD_LENGTH),
          Validators.maxLength(this.MAX_PASSWORD_LENGTH)
        ])
      ]);
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

    let empty = false;
    if (this.f.password.value === '' && this.showPassword && this.f.status.value.toString() === 'false') {
      empty = true;
    }

    if (this.userForm.valid) {
      const userToSave = this.generateUserToSave(empty);
      this.saveUser.emit(userToSave);
    }
  }

  generateUserToSave(empty: boolean) {
    const password = empty ? this.generateRandomPassword() : this.getPassword();

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
      SendWelcomeEmail: password ? this.f.sendWelcomeEmail.value : false,
      UserSubsidiaryIds: this.selectedValues
    };
  }

  getPassword() {
    if (this.user.LastLogin) {
      return null;
    } else {
      return this.showPassword ? this.f.password.value : this.generateRandomPassword();
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
}
