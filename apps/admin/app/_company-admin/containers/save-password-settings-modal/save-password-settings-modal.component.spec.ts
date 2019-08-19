import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { SavePasswordSettingsModalComponent } from './save-password-settings-modal.component';
import * as fromRootState from 'libs/state/state';
import * as fromAdminReducer from '../../reducers';
import * as fromCompanyAdminActions from '../../actions';
import { CompanySettingsSaveRequest } from '../../../../../../libs/models/payfactors-api/settings/request';

describe('SavePasswordSettingsModalComponent', () => {
  let component: SavePasswordSettingsModalComponent;
  let fixture: ComponentFixture<SavePasswordSettingsModalComponent>;
  let store: Store<fromAdminReducer.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SavePasswordSettingsModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers
        }),
        StoreModule.forFeature('companyAdminMain', fromAdminReducer.reducers)
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(SavePasswordSettingsModalComponent);
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
    const expectedAction = new fromCompanyAdminActions.SaveCompanyAdminPasswordSettings(saveRequest);
    const spy = spyOn(store, 'dispatch');

    component.handleSaveConfirmed();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it ('SavePasswordSettingsModalComponent - should dispatch SaveCompanyAdminPasswordSettingsPromptClose on cancel', () => {
    const expectedAction = new fromCompanyAdminActions.SaveCompanyAdminPasswordSettingsPromptClose();
    const spy = spyOn(store, 'dispatch');

    component.handleSaveDenied();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
