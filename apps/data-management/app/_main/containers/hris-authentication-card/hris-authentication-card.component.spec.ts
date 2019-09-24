import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromDataManagementMainReducer from '../../reducers';
import * as fromTransferDataPageActions from '../../actions/transfer-data-page.actions';
import { HrisAuthenticationCardComponent } from './hris-authentication-card.component';
import { generateMockProvider } from '../../models';
import { generateMockCredentialsPackage } from 'libs/models';

describe('Data Management - Main - Hris Authentication Card', () => {
  let instance: HrisAuthenticationCardComponent;
  let fixture: ComponentFixture<HrisAuthenticationCardComponent>;
  let store: Store<fromDataManagementMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        })
      ],
      declarations: [
        HrisAuthenticationCardComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrisAuthenticationCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should dispath an action when form is submitted', () => {
    spyOn(store, 'dispatch');
    instance.provider = generateMockProvider();
    const mockCredsPackage = generateMockCredentialsPackage();
    const mockFormValues = {
      apiKey: 'MockApiKey',
      domain: 'MockDomain',
      username: 'MockUserName',
      password: 'MockPassword'
    };

    instance.submitFormEvent(mockFormValues);

    const expectedInitAction =
      new fromTransferDataPageActions.Validate(mockCredsPackage);

    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedInitAction);
  });

  it('should dispatch a reset action when cancel button is clicked', () => {
    spyOn(store, 'dispatch');

    instance.cancelAuthClick();

    const expectedResetWorkflowAction = new fromTransferDataPageActions.ResetTransferDataPageWorkflow();
    expect(store.dispatch).toHaveBeenCalledWith(expectedResetWorkflowAction);
  });
});
