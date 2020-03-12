import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockCredentialsPackage } from 'libs/models';

import * as fromDataManagementMainReducer from '../../../reducers';
import * as fromTransferDataPageActions from '../../../actions/transfer-data-page.actions';
import * as fromOutboundJdmActions from '../../../actions/outbound-jdm.actions';
import { OutboundAuthenticationPageComponent } from './outbound-authentication.page';

describe('Data Management - Main - Outbound Authentication Page', () => {
  let instance: OutboundAuthenticationPageComponent;
  let fixture: ComponentFixture<OutboundAuthenticationPageComponent>;
  let store: Store<fromDataManagementMainReducer.State>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          transferDataMain: combineReducers(fromDataManagementMainReducer.reducers),
        }),
        RouterTestingModule.withRoutes([{
          path: '**',
          redirectTo: '',
        }]),
      ],
      providers: [],
      declarations: [
        OutboundAuthenticationPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutboundAuthenticationPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should dispatch an action when validating credentials', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const mockCredsPackage = generateMockCredentialsPackage();
    const expectedAction = new fromTransferDataPageActions.OutboundJdmValidate(mockCredsPackage);

    // act
    instance.validateCredentials(mockCredsPackage);

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a reset action on cancel', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const expectedResetWorkflowAction = new fromTransferDataPageActions.ResetTransferDataPageWorkflow();
    const expectedResetConnectionAction = new fromOutboundJdmActions.ResetConnectionSummary();

    // act
    instance.cancel();

    // assert
    expect(spy).toHaveBeenCalledWith(expectedResetWorkflowAction);
    expect(spy).toHaveBeenCalledWith(expectedResetConnectionAction);
  });

  it('should dispatch an action on next', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const mockCredsPackage = generateMockCredentialsPackage();
    const expectedAction = new fromOutboundJdmActions.SaveCredentials(mockCredsPackage);

    // act
    instance.next(mockCredsPackage);

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should navigate to field mappings on next', () => {
    // arrange
    const spy = jest.spyOn(router, 'navigate');
    const mockCredsPackage = generateMockCredentialsPackage();
    const expectedRoute = ['/transfer-data/outbound/jdm-view-selection'];

    // act
    instance.next(mockCredsPackage);

    // assert
    expect(spy).toHaveBeenCalledWith(expectedRoute);
  });
});
