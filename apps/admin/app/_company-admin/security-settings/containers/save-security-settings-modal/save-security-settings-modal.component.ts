import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

import * as fromPasswordSettingsReducer from '../../reducers';
import * as fromPasswordSettingActions from '../../actions/security-settings.action';

@Component({
  selector: 'pf-save-security-settings-modal',
  templateUrl: './save-security-settings-modal.component.html',
  styleUrls: ['./save-security-settings-modal.component.scss']
})
export class SaveSecuritySettingsModalComponent implements OnInit {
  @Input()
  public request: CompanySettingsSaveRequest;
  public savingPasswordSettings$: Observable<boolean>;
  public savingPasswordSettingsModalOpen$: Observable<boolean>;

  constructor(private store: Store<fromPasswordSettingsReducer.State>) {}

  ngOnInit() {
    this.savingPasswordSettingsModalOpen$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettingsModalOpen);
    this.savingPasswordSettings$ = this.store.select(fromPasswordSettingsReducer.getPasswordSettingsSaving);
  }

  handleSaveConfirmed() {
    this.store.dispatch(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettings(this.request));
  }

  handleSaveDenied() {
    this.store.dispatch(new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsPromptClose());
  }
}
