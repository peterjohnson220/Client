import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

import * as fromPasswordSettingsReducer from '../../reducers';
import * as fromPasswordSettingActions from '../../actions/password-management-settings.action';

@Component({
  selector: 'pf-save-password-settings-modal',
  templateUrl: './save-password-settings-modal.component.html',
  styleUrls: ['./save-password-settings-modal.component.scss']
})
export class SavePasswordSettingsModalComponent implements OnInit {
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
