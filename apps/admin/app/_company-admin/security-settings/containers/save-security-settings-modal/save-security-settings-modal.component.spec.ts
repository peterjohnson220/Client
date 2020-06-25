import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { SaveSecuritySettingsModalComponent } from './save-security-settings-modal.component';
import * as fromRootState from 'libs/state/state';
import * as fromPasswordSettingsReducer from '../../reducers';
import * as fromPasswordSettingActions from '../../actions/security-settings.action';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings/request';

describe('SavePasswordSettingsModalComponent', () => {
  let component: SaveSecuritySettingsModalComponent;
  let fixture: ComponentFixture<SaveSecuritySettingsModalComponent>;
  let store: Store<fromPasswordSettingsReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SaveSecuritySettingsModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('companyAdminPasswordSettings', fromPasswordSettingsReducer.reducers)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SaveSecuritySettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('SavePasswordSettingsModalComponent - should dispatch SaveCompanyAdminPasswordSettings on confirmation', () => {
    component.savingPasswordSettingsModalOpen$ = of(true);
    const saveRequest: CompanySettingsSaveRequest = {
      CompanyId: 13,
      Settings: []
    };
    component.request = saveRequest;
    const expectedAction = new fromPasswordSettingActions.SaveCompanyAdminPasswordSettings(saveRequest);
    const spy = spyOn(store, 'dispatch');

    component.handleSaveConfirmed();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it ('SavePasswordSettingsModalComponent - should dispatch SaveCompanyAdminPasswordSettingsPromptClose on cancel', () => {
    const expectedAction = new fromPasswordSettingActions.SaveCompanyAdminPasswordSettingsPromptClose();
    const spy = spyOn(store, 'dispatch');

    component.handleSaveDenied();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
