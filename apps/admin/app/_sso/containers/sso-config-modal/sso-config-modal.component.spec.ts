import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockCustomerConnection, generateMockSelectedCustomerConnection } from 'libs/models/sso';
import { MockSelectedCompany } from 'libs/features/company/company-selector/models';
import { PfValidators } from 'libs/forms/validators';


import * as fromSsoConfigActions from '../../actions/sso-config.actions';
import { SsoConfigModalComponent } from './sso-config-modal.component';
import * as fromSsoConfigReducers from '../../reducers';

describe('Sso Config Modal', () => {
  let instance: SsoConfigModalComponent;
  let fixture: ComponentFixture<SsoConfigModalComponent>;
  let store: Store<fromSsoConfigReducers.State>;
  let router: Router;
  let formBuilder: FormBuilder;
  const mockSsoCustomerConnection = generateMockCustomerConnection();
  const mockSelectedCustomerConnection = generateMockSelectedCustomerConnection();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          sso_ssoConfig: combineReducers(fromSsoConfigReducers.reducers),
        }),
        ReactiveFormsModule
      ],
      declarations: [ SsoConfigModalComponent ],
      providers: [
        {
          provide: Router,

          useValue: { navigate: jest.fn() }
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(SsoConfigModalComponent);
    instance = fixture.componentInstance;
    instance.addSsoForm = formBuilder.group({
      email: ['', [PfValidators.required]],
      file: [null, PfValidators.required],
      logOutUrl: '',
    });
    instance.editSsoForm = formBuilder.group({
      CompanyName: [''],
      IdpId: [''],
      EmailDomain: ['', PfValidators.required],
      MetadataFile: [null],
      SsoLogOutUrl: [''],
      Certificate: [null]
    });
    instance.companySelected = MockSelectedCompany();
    instance.customerConnectionData = generateMockSelectedCustomerConnection();
    instance.xmlMetadata = '';
    instance.xmlCertificate = '';
    instance.modalType = 'Add';
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should dispatch a SsoConfigure action on add modal submits', () => {
    spyOn(store, 'dispatch');
    instance.modalType = 'Add';
    const addSsoFormData = {email: mockSsoCustomerConnection.Email, file: mockSsoCustomerConnection.FileData, logOutUrl: mockSsoCustomerConnection.LogOutUrl};
    const expectedAction = new fromSsoConfigActions.SsoConfigure(mockSsoCustomerConnection);

    instance.onSubmit(addSsoFormData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);

  });

  it('should dispatch a UpdatingSsoConfiguration action on edit modal submits', () => {
    spyOn(store, 'dispatch');
    instance.modalType = 'Edit';
    const expectedAction = new fromSsoConfigActions.UpdatingSsoConfiguration(mockSelectedCustomerConnection);

    instance.onSubmit(mockSelectedCustomerConnection);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a CloseSsoConfigModal action on handleModalDismissed', () => {
    spyOn(store, 'dispatch');
    const expectedAction1 = new fromSsoConfigActions.CloseSsoConfigModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedAction1);
  });

  it('should dispatch a DisplayNewSso action on DisplaySsoInGrid', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromSsoConfigActions.GetSsoConfiguration();

    instance.displaySsoInGrid();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
