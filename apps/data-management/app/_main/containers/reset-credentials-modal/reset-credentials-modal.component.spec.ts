import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromServiceAccountActions from 'libs/features/service-accounts/actions';
import * as fromServiceAccountReducer from 'libs/features/service-accounts/reducers';
import { ServiceAccountReportClass } from 'libs/constants/service-accounts';
import { ServiceAccountUser, ServiceAccountUserStatus } from 'libs/models/service-accounts';

import { ResetCredentialsModalComponent } from './reset-credentials-modal.component';

describe('Data Management - Main - Outbound Bulk Jobs Export Scheduler Page', () => {
  let instance: ResetCredentialsModalComponent;
  let fixture: ComponentFixture<ResetCredentialsModalComponent>;
  let store: Store<fromServiceAccountReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_serviceAccounts: combineReducers(fromServiceAccountReducer.reducers),
        }),
        RouterTestingModule.withRoutes([{
          path: '**',
          redirectTo: '',
        }]),
      ],
      providers: [],
      declarations: [
        ResetCredentialsModalComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetCredentialsModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should dispatch a dismiss modal action when reset modal dismiss button clicked', () => {
    spyOn(store, 'dispatch');

    const expectedModalDismissAction = new fromServiceAccountActions.CloseResetAccountModal();

    instance.handleResetAccountModalDismiss();

    expect(store.dispatch).toHaveBeenCalledWith(expectedModalDismissAction);
  });

  it('should dispatch a dismiss modal action when new credentials modal dismiss button clicked', () => {
    spyOn(store, 'dispatch');

    const expectedModalDismissAction = new fromServiceAccountActions.CloseNewAccountModal();

    instance.handleNewAccountModalDismiss();

    expect(store.dispatch).toHaveBeenCalledWith(expectedModalDismissAction);
  });

  it('should dispatch a dismiss modal action when new credentials modal dismiss button clicked', () => {
    spyOn(store, 'dispatch');

    const expectedModalDismissAction = new fromServiceAccountActions.CloseNewAccountModal();

    instance.handleNewAccountModalDismiss();

    expect(store.dispatch).toHaveBeenCalledWith(expectedModalDismissAction);
  });

  it('should dispatch a dismiss modal action when new credentials modal dismiss button clicked', () => {
    spyOn(store, 'dispatch');

    const expectedResetAction = new fromServiceAccountActions.ResetServiceAccount({
      Purpose: 'Resetting Account for JDM Export Api',
      ReportClass: ServiceAccountReportClass.HrisOutboundJobs,
    });
    const expectedCloseModalAction = new fromServiceAccountActions.CloseResetAccountModal();
    const expectedOpenNewAccountModalAction = new fromServiceAccountActions.OpenNewAccountModal();

    instance.resetCredentials();

    expect(store.dispatch).toHaveBeenCalledWith(expectedResetAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedCloseModalAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedOpenNewAccountModalAction);
  });


});
