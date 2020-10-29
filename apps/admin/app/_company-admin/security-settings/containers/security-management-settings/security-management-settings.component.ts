import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { GenericNameValueDto } from 'libs/models/common';
import { CompanySetting, CompanySettingsEnum } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';
import * as fromRootReducer from 'libs/state/state';

import * as fromPasswordSettingsReducer from '../../reducers';
import * as fromPasswordSettingActions from '../../actions/security-settings.action';

@Component({
  selector: 'pf-security-management-settings',
  templateUrl: './security-management-settings.component.html',
  styleUrls: ['./security-management-settings.component.scss']
})
export class SecurityManagementSettingsComponent implements OnInit, OnDestroy {
  @Output() valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private passwordExpirationEnabled: boolean;
  private passwordHistoryEnabled: boolean;
  private passwordExpirationDays: string;
  private sessionTimeoutMinutes: string;
  private passwordHistoryNumber: string;

  public passwordForm: FormGroup;
  public request: CompanySettingsSaveRequest;
  public passwordSettingsLoading$: Observable<boolean>;
  public passwordSettingsLoadingError$: Observable<boolean>;
  private passwordSettings$: Observable<CompanySetting[]>;
  private passwordSettingSubscription: Subscription;
  private unsubscribe$ = new Subject();
  private defaultDays: string;
  private defaultNum: string;
  private companyId: number;

  constructor(private store: Store<fromPasswordSettingsReducer.State>,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.store.dispatch(new fromPasswordSettingActions.LoadCompanyAdminPasswordSettings());
    this.passwordSettingsLoading$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettingsLoading);
    this.passwordSettingsLoadingError$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettingsLoadingError);
    this.passwordSettings$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettings);
    this.configureSubscription();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  createForm(): void {
    this.defaultDays = '';
    this.defaultNum = '';

    if (this.passwordExpirationEnabled) {
      this.defaultDays = this.passwordExpirationDays.toString();
    }
    if (this.passwordHistoryEnabled) {
      this.defaultNum = this.passwordHistoryNumber.toString();
    }

    this.resetForm();
  }

  public trySubmit(): void {
    if (this.passwordForm.valid && this.passwordForm.dirty) {
      this.request = this.getSaveRequest();

      if (this.request.Settings.length) {
        this.store.dispatch(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettings(this.request));
      }
    }
  }

  public resetForm(): void {
    this.passwordForm = this.formBuilder.group({
      passwordExpirationDays: new FormControl(this.defaultDays, this.validateExpirationDays.bind(this)),
      passwordHistoryNumber: new FormControl(this.defaultNum, this.validateHistoryNumber.bind(this)),
      sessionTimeoutMinutes: new FormControl(this.sessionTimeoutMinutes,  this.validateSessionTimeoutMinutesNumber.bind(this))
    });
    this.valueChange.emit(false);
    this.passwordForm.get('passwordExpirationDays').valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
        this.valueChange.emit(true);
      });
    this.passwordForm.get('passwordHistoryNumber').valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
        this.valueChange.emit(true);
      });
    this.passwordForm.get('sessionTimeoutMinutes').valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
        this.valueChange.emit(true);
      });
  }

  configureSubscription(): void {
    this.passwordSettingSubscription = this.passwordSettings$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(v => {
        v.forEach(i => this.parseCompanySetting(i));
        this.createForm();
      });
    this.store.select(fromRootReducer.getUserContext)
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(v => !!v))
      .subscribe(v => {
        this.companyId = v.CompanyId;
      });
  }

  getSaveRequest(): CompanySettingsSaveRequest {
    const historyNumber = this.passwordForm.get('passwordHistoryNumber');
    const expirationDays = this.passwordForm.get('passwordExpirationDays');
    const sessionTimeoutMinutes = this.passwordForm.get('sessionTimeoutMinutes');
    const request: CompanySettingsSaveRequest = { CompanyId: this.companyId, Settings: []};

    if (historyNumber.dirty) {
      if (historyNumber.value > 0) {
        request.Settings.push({Name: 'PasswordHistoryEnabled', Value: 'true'} as GenericNameValueDto);
        request.Settings.push({Name: 'PasswordHistoryNumber', Value: historyNumber.value} as GenericNameValueDto);
      } else {
        request.Settings.push({Name: 'PasswordHistoryEnabled', Value: 'false'} as GenericNameValueDto);
      }
    }
    if (expirationDays.dirty) {
      if (expirationDays.value > 0) {
        request.Settings.push({Name: 'PasswordExpirationEnabled', Value: 'true'} as GenericNameValueDto);
        request.Settings.push({Name: 'PasswordExpirationDays', Value: expirationDays.value} as GenericNameValueDto);
      } else {
        request.Settings.push({Name: 'PasswordExpirationEnabled', Value: 'false'} as GenericNameValueDto);
      }
    }

    if (sessionTimeoutMinutes.dirty) {
      if (sessionTimeoutMinutes.value > 0) {
        request.Settings.push({Name: 'SessionTimeoutMinutes', Value: sessionTimeoutMinutes.value} as GenericNameValueDto);
      } else {
        request.Settings.push({Name: 'SessionTimeoutMinutes', Value: '360'} as GenericNameValueDto);
      }
    }
    return request;
  }

  parseCompanySetting(setting: CompanySetting): void {
    switch (setting.Key) {
      case CompanySettingsEnum.PasswordExpirationEnabled:
        this.passwordExpirationEnabled = setting.Value.toLowerCase() === 'true';
        break;
      case CompanySettingsEnum.PasswordExpirationDays:
        this.passwordExpirationDays = setting.Value;
        break;
      case CompanySettingsEnum.PasswordHistoryEnabled:
        this.passwordHistoryEnabled = setting.Value.toLowerCase() === 'true';
        break;
      case CompanySettingsEnum.PasswordHistoryNumber:
        this.passwordHistoryNumber = setting.Value;
        break;
      case CompanySettingsEnum.SessionTimeoutMinutes:
        this.sessionTimeoutMinutes = setting.Value;
        break;
      default:
        break;
    }
  }

  validateExpirationDays(c: FormControl) {
    const valid = this.isBetween(c, 1, 1000);
    if (!valid) {
      return {
        validExpirationDays: true
      };
    }
    return null;
  }

  validateHistoryNumber(c: FormControl) {
    const valid = this.isBetween(c, 1, 1000);
    if (!valid) {
      return {
        validHistoryNumber: true
      };
    }
    return null;
  }

  validateSessionTimeoutMinutesNumber(c: FormControl) {
    const valid = this.isBetween(c, 5, 360);
    if (!valid) {
      return {
        validSessionTimeoutMinutesNumber: true
      };
    }
    return null;
  }

  isBetween(c: FormControl, min: number, max: number): boolean {
    if (c.value === '' || c.value === null) {
      return true;
    }
    const numbers = /^[0-9]+$/;
    if (!c.value.match(numbers)) {
      return false;
    }
    const val = Number.parseInt(c.value, 10);
    return !(!val || val < min || val > max);
  }

  checkValidity(field: string): boolean {
    return this.passwordForm.get(field).valid;
  }

  isDirty(field: string) {
    return this.checkValidity(field) && this.passwordForm.get(field).dirty && this.passwordForm.get(field).value;
  }

  isClear(field: string) {
    return !this.passwordForm.get(field).value;
  }

  clearField(field: string) {
    this.passwordForm.get(field).setValue('');
    this.passwordForm.get(field).markAsDirty();
  }
}
