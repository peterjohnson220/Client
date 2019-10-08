import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

import * as fromPasswordSettingsReducer from '../reducers';
import { PasswordManagementSettingsComponent } from '../containers';

@Component({
  selector: 'pf-password-management-page',
  templateUrl: './password-management.page.html',
  styleUrls: ['./password-management.page.scss']
})
export class PasswordManagementPageComponent implements OnInit {
  env = environment;

  @ViewChild(PasswordManagementSettingsComponent, { static: true }) settingsComponent: PasswordManagementSettingsComponent;
  public passwordSettingsSaving$: Observable<boolean>;
  public isDirty = false;

  constructor(private store: Store<fromPasswordSettingsReducer.State>) {}

  ngOnInit() {
    this.passwordSettingsSaving$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettingsSaving);
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
