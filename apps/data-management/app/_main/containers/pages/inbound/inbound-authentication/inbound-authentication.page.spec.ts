import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockCredentialsPackage } from 'libs/models';

import * as fromDataManagementMainReducer from '../../../../reducers';
import * as fromTransferDataPageActions from '../../../../actions/transfer-data-page.actions';
import * as fromHrisConnectionActions from '../../../../actions/hris-connection.actions';
import { InboundAuthenticationPageComponent } from './inbound-authentication.page';

describe('Data Management - Main - Inbound Authentication Page', () => {
  let instance: InboundAuthenticationPageComponent;
  let fixture: ComponentFixture<InboundAuthenticationPageComponent>;
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
        InboundAuthenticationPageComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboundAuthenticationPageComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should dispatch an action when validating credentials', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const mockCredsPackage = generateMockCredentialsPackage();
    const expectedAction = new fromHrisConnectionActions.Validate(mockCredsPackage);

    // act
    instance.validateCredentials(mockCredsPackage);

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a reset action on cancel', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const expectedAction = new fromTransferDataPageActions.ResetTransferDataPageWorkflow();

    // act
    instance.cancel();

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action on next', () => {
    // arrange
    const spy = jest.spyOn(store, 'dispatch');
    const mockCredsPackage = generateMockCredentialsPackage();
    const expectedAction = new fromHrisConnectionActions.CreateConnection(mockCredsPackage);

    // act
    instance.next(mockCredsPackage);

    // assert
    expect(spy).toHaveBeenCalledWith(expectedAction);
  });
});
