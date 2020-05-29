import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbstractControl, AsyncValidatorFn, FormGroup, FormControl,
         FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, Exchange, generateMockExchange, RequestExchangeRequest } from 'libs/models/index';
import {PfValidators} from 'libs/forms/validators';

import {ExchangeJobRequestCandidate, generateMockExchangeJobRequestCandidate} from '../../../models';
import * as fromPeerManagementReducer from '../../../reducers/index';
import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import { RequestJobModalComponent } from './request-job-modal.component';

describe('Peer - Manage - Request Job Modal', () => {
  let fixture: ComponentFixture<RequestJobModalComponent>;
  let instance: RequestJobModalComponent;
  const mockExchange: Exchange = generateMockExchange();

  let store: Store<fromPeerManagementReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        RequestJobModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(RequestJobModalComponent);
    instance = fixture.componentInstance;

    instance.exchange$ = of(mockExchange);
  });

  it('should set exchange on init', () => {
    fixture.detectChanges();

    expect(instance.exchange).toEqual(mockExchange);
  });

  it(`should render job selection form component and a 'New Job' link when newFormEnabled is false`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should render new job form component and an 'Existing Jobs' link when newFormEnabled is true`, () => {
    instance.newJobFormEnabled = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a CreateExchangeRequest action of type PayfactorsJob with an
  ExchangeRequestModel of type NewJob when newJobFormEnabled is true and handleFormSubmit is called`, () => {
    const mockNewJobForm = generateMockNewJobForm();
    const mockExchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: mockExchange.ExchangeId,
      Reason: mockNewJobForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.NewJob,
      TypeData: {
        JobTitle: mockNewJobForm.get('jobTitle').value,
        JobFamily: mockNewJobForm.get('jobFamily').value,
        JobLevel: mockNewJobForm.get('jobLevel').value,
        JobDescription: mockNewJobForm.get('jobDescription').value
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.PayfactorsJob,
      mockExchangeRequestModel
    );

    instance.newJobFormEnabled = true;
    instance.exchangeJobRequestForm.addControl('newJobForm', mockNewJobForm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch a CreateExchangeRequest action of type PayfactorsJob with an
  ExchangeRequestModel of type PayfactorsJob when newJobFormEnabled is false and handleFormSubmit is called`, () => {
    const mockJobSelectionForm = generateMockPayfactorsJobSelectionForm();
    const mockExchangeCandidate: ExchangeJobRequestCandidate = generateMockExchangeJobRequestCandidate();
    const mockExchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: mockExchange.ExchangeId,
      Reason: mockJobSelectionForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.PayfactorsJob,
      TypeData: {
        MDJobsBaseId: mockExchangeCandidate.MDJobsBaseId
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.PayfactorsJob,
      mockExchangeRequestModel
    );

    instance.exchangeJobRequestForm.addControl('jobSelectionForm', mockJobSelectionForm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch CloseExchangeRequestModal action of type PayfactorsJob and set newFormEnabled to false
  when handleModalDismissed is called`, () => {
    const expectedAction = new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob);
    instance.newJobFormEnabled = true;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleModalDismissed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.newJobFormEnabled).toEqual(false);
  });

  it(`should dispatch ResetExchangeRequest action of type PayfactorsJob when newJobFormEnabled is toggled off`, () => {
      const expectedAction = new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.PayfactorsJob);
      instance.newJobFormEnabled = true;

      spyOn(store, 'dispatch');

      fixture.detectChanges();

      instance.handleSwitchToggled();

      expect(store.dispatch).toBeCalledWith(expectedAction);
    });

  it(`should not dispatch ResetExchangeRequest action of type PayfactorsJob when newJobFormEnabled is toggled on`, () => {
    const expectedAction = new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.PayfactorsJob);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleSwitchToggled();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it(`should clear the newJobForm when newJobFormEnabled is toggled off`, () => {
    instance.newJobFormEnabled = true;

    fixture.detectChanges();

    instance.exchangeJobRequestForm.addControl('newJobForm', generateMockNewJobForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const newJobForm = instance.exchangeJobRequestForm.get('newJobForm');
    expect(newJobForm).toBe(null);
  });

  it(`should clear the jobSelectionForm when newJobFormEnabled is toggled on`, () => {
    fixture.detectChanges();

    instance.exchangeJobRequestForm.addControl('jobSelectionForm', generateMockNewJobForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const newJobForm = instance.exchangeJobRequestForm.get('jobSelectionForm');
    expect(newJobForm).toBe(null);
  });

  it(`should clear the childFormGroup from the exchangeJobRequestForm after form submits`, () => {
    instance.newJobFormEnabled = true;

    fixture.detectChanges();

    instance.exchangeJobRequestForm.addControl('newJobForm', generateMockNewJobForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const childForm = instance.childFormGroup;
    expect(childForm).toBe(null);
  });

  it(`should have the exchange name in the modalSubtitle`, () => {
    const expectedModalSubtitle = `Search for and select an existing job, or create a new job that you would like added to the
            ${mockExchange.ExchangeName} exchange. The exchange administrator will
            determine if the job will be added to the exchange.`;

    fixture.detectChanges();

    expect(instance.modalSubTitle).toEqual(expectedModalSubtitle);
  });
});

function generateMockPayfactorsJobSelectionForm(): FormGroup {
  const mockExchangeJobRequestCandidate: ExchangeJobRequestCandidate = generateMockExchangeJobRequestCandidate();
  return new FormGroup({
    'reason': new FormControl('MockReason', [PfValidators.required]),
    'payfactorsJobSelection': new FormControl(mockExchangeJobRequestCandidate, [Validators.required])
  });
}

function generateMockNewJobForm(): FormGroup {
  return new FormGroup({
    'reason': new FormControl('MockReason', [PfValidators.required]),
    'jobTitle': new FormControl('MockJobTitle', [PfValidators.required, Validators.minLength(3)], [mockJobTitleValidator()]),
    'jobFamily': new FormControl('MockJobFamily'),
    'jobLevel': new FormControl('MockJobLevel'),
    'jobDescription': new FormControl('MockJobDescription')
  });
}
function mockJobTitleValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    return of(null);
  };
}
