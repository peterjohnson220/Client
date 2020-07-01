import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { SsoUrl } from 'libs/constants';
import { generateMockCustomerConnection } from 'libs/models/sso';
import { MockSelectedCompany } from 'libs/features/company/company-selector/models';

import * as fromSsoConfigActions from '../../actions/sso-config.actions';
import { AddSsoConfigModalComponent } from './add-sso-config-modal.component';
import * as fromSsoConfigReducers from '../../reducers';

describe('Add Sso Config Modal', () => {
  let instance: AddSsoConfigModalComponent;
  let fixture: ComponentFixture<AddSsoConfigModalComponent>;
  let store: Store<fromSsoConfigReducers.State>;
  let router: Router;
  let formBuilder: FormBuilder;
  const mockSsoCustomerConnection = generateMockCustomerConnection();
  const customerConnection = {
    EmailDomain: mockSsoCustomerConnection.Email.split('@')[ 1 ],
    CompanyId: mockSsoCustomerConnection.CompanyId,
    CompanyName: 'pf company test',
    IdpId: mockSsoCustomerConnection.Email.split('@')[ 1 ],
    SsoLogOutUrl: SsoUrl.SSO_DEFAULT_LOGOUT_URL
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          sso_ssoConfig: combineReducers(fromSsoConfigReducers.reducers),
        }),
        ReactiveFormsModule
      ],
      declarations: [ AddSsoConfigModalComponent ],
      providers: [
        {
          provide: Router,

          useValue: { navigate: jest.fn() }
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(AddSsoConfigModalComponent);
    instance = fixture.componentInstance;
    instance.ssoForm = formBuilder.group({
      email: ['', [Validators.required]],
      file: [null, Validators.required],
      logOutUrl: '',
    });
    instance.companySelected = MockSelectedCompany();
    instance.xmlData = '';
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should dispatch a SsoConfigure action on modal submits', () => {
    spyOn(store, 'dispatch');
    const formData = {email: mockSsoCustomerConnection.Email, file: mockSsoCustomerConnection.FileData, logOutUrl: mockSsoCustomerConnection.LogOutUrl}
    const expectedAction = new fromSsoConfigActions.SsoConfigure(mockSsoCustomerConnection);

    instance.onSubmit(formData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CloseAddSsoConfigModal action on handleModalDismissed', () => {
    spyOn(store, 'dispatch');
    const expectedAction1 = new fromSsoConfigActions.CloseAddSsoConfigModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction1);
  });

  it('should dispatch a DisplayNewSso action on DisplaySsoInGrid', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromSsoConfigActions.DisplayNewSso(customerConnection);

    instance.displaySsoInGrid(mockSsoCustomerConnection);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
