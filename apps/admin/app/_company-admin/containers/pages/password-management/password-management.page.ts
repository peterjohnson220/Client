import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromCompanyAdminReducer from '../../../reducers';
import { PasswordManagementSettingsComponent } from '../../password-management-settings';

@Component({
  selector: 'pf-company-admin-password-management',
  templateUrl: './password-management.page.html',
  styleUrls: ['./password-management.page.scss']
})
export class PasswordManagementPageComponent implements OnInit {
  @ViewChild(PasswordManagementSettingsComponent, { static: true }) settingsComponent: PasswordManagementSettingsComponent;
  public passwordSettingsSaving$: Observable<boolean>;
  public isDirty = false;

  constructor(private store: Store<fromCompanyAdminReducer.State>) {}

  ngOnInit() {
    this.passwordSettingsSaving$ = this.store.select(fromCompanyAdminReducer.getPasswordSettingsSaving);
  }

  save() {
    this.settingsComponent.trySubmit();
  }
  cancel() {
    this.settingsComponent.resetForm();
  }

  setDirty($value: boolean) {
    this.isDirty = $value;
  }
}
