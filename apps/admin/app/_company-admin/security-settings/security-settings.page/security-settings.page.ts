import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

import * as fromPasswordSettingsReducer from '../reducers';
import { SecurityManagementSettingsComponent } from '../containers';

@Component({
  selector: 'pf-security-settings-page',
  templateUrl: './security-settings.page.html',
  styleUrls: ['./security-settings.page.scss']
})
export class SecuritySettingsPageComponent implements OnInit {
  env = environment;

  @ViewChild(SecurityManagementSettingsComponent, { static: true }) settingsComponent: SecurityManagementSettingsComponent;
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
