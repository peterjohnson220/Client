import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbstractControl, AsyncValidatorFn, FormGroup, FormControl,
         FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, Exchange, generateMockExchange, RequestExchangeRequest } from 'libs/models/index';
import { PfValidators } from 'libs/forms/validators';

import * as fromPeerDashboardReducer from '../../../reducers/index';
import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import { InviteCompanyModalComponent } from './invite-company-modal.component';
import { ExistingCompany, generateMockExistingCompany } from '../../../models';

describe('Peer - Dashboard - Invite Company Modal', () => {
  let fixture: ComponentFixture<InviteCompanyModalComponent>;
  let instance: InviteCompanyModalComponent;
  const mockExchange: Exchange = generateMockExchange();

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        InviteCompanyModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(InviteCompanyModalComponent);
    instance = fixture.componentInstance;

    instance.exchange$ = of(mockExchange);
  });

  it('should set exchange on init', () => {
    fixture.detectChanges();

    expect(instance.exchange).toEqual(mockExchange);
  });

  it(`should render company selection form component and a 'New Company' link when newCompanyFormEnabled is false`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should render new company form component and an 'Existing Companies' link when newCompanyFormEnabled is true`, () => {
    instance.newCompanyFormEnabled = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a CreateExchangeRequest action of type ReferPayfactorsCompany with an
  ExchangeRequestModel of type ReferNewCompany when newCompanyFormEnabled is true and handleFormSubmit is called`, () => {
    const mockNewJobForm = generateMockNewCompanyForm();
    const mockExchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: mockExchange.ExchangeId,
      Reason: mockNewJobForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.ReferNewCompany,
      TypeData: {
        CompanyName: mockNewJobForm.get('companyName').value,
        Industry: mockNewJobForm.get('industry').value,
        ContactName: mockNewJobForm.get('contactName').value,
        ContactJobTitle: mockNewJobForm.get('contactJobTitle').value,
        EmailAddress: mockNewJobForm.get('contactEmailAddress').value,
        PhoneNumber: mockNewJobForm.get('contactPhoneNumber').value
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      mockExchangeRequestModel
    );

    instance.newCompanyFormEnabled = true;
    instance.requestCompanyForm.addControl('newCompanyForm', mockNewJobForm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch a CreateExchangeRequest action of type ReferPayfactorsCompany with an
  ExchangeRequestModel of type ReferPayfactorsCompany when newCompanyFormEnabled is false and handleFormSubmit is called`, () => {
    const mockExistingCompanySelectionForm = generateMockExistingCompanySelectionForm();
    const mockExchangeCandidate: ExistingCompany = generateMockExistingCompany();
    const mockExchangeRequestModel: RequestExchangeRequest = {
      ExchangeId: mockExchange.ExchangeId,
      Reason: mockExistingCompanySelectionForm.get('reason').value,
      Type: ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      TypeData: {
        CompanyId: mockExchangeCandidate.CompanyId
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      mockExchangeRequestModel
    );

    instance.requestCompanyForm.addControl('companySelectionForm', mockExistingCompanySelectionForm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch CloseExchangeRequestModal action of type ReferPayfactorsCompany and set newCompanyFormEnabled to false
  when handleModalDismissed is called`, () => {
    const expectedAction = new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany);
    instance.newCompanyFormEnabled = true;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleModalDismissed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
    expect(instance.newCompanyFormEnabled).toEqual(false);
  });

  it(`should dispatch ResetExchangeRequest action of type ReferPayfactorsCompany when newCompanyFormEnabled is toggled off`, () => {
    const expectedAction = new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.ReferPayfactorsCompany);
    instance.newCompanyFormEnabled = true;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleSwitchToggled();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should not dispatch ResetExchangeRequest action of type ReferPayfactorsCompany when newCompanyFormEnabled is toggled on`, () => {
    const expectedAction = new fromExchangeRequestActions.ResetExchangeRequest(ExchangeRequestTypeEnum.ReferPayfactorsCompany);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleSwitchToggled();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it(`should clear the newCompanyForm when newCompanyFormEnabled is toggled off`, () => {
    instance.newCompanyFormEnabled = true;

    fixture.detectChanges();

    instance.requestCompanyForm.addControl('newCompanyForm', generateMockNewCompanyForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const newJobForm = instance.requestCompanyForm.get('newCompanyForm');
    expect(newJobForm).toBe(null);
  });

  it(`should clear the companySelectionForm when newCompanyFormEnabled is toggled on`, () => {
    fixture.detectChanges();

    instance.requestCompanyForm.addControl('companySelectionForm', generateMockExistingCompanySelectionForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const newJobForm = instance.requestCompanyForm.get('companySelectionForm');
    expect(newJobForm).toBe(null);
  });

  it(`should clear the childFormGroup from the requestCompanyForm after form submits`, () => {
    instance.newCompanyFormEnabled = true;

    fixture.detectChanges();

    instance.requestCompanyForm.addControl('newCompanyForm', generateMockNewCompanyForm());

    fixture.detectChanges();

    instance.handleSwitchToggled();

    const childForm = instance.childFormGroup;
    expect(childForm).toBe(null);
  });

  it(`should have the exchange name in the modalSubtitle`, () => {
    const expectedModalSubtitle = `Search for and select an existing company, or invite a new company that you would like added to the
            ${mockExchange.ExchangeName} exchange. The exchange administrator will
            determine if the company will be added to the exchange.`;

    fixture.detectChanges();

    expect(instance.modalSubTitle).toEqual(expectedModalSubtitle);
  });
});

function generateMockExistingCompanySelectionForm(): FormGroup {
  const mockExistingCompanyCandidate: ExistingCompany = generateMockExistingCompany();
  return new FormGroup({
    'reason': new FormControl('MockReason', [PfValidators.required]),
    'companySelection': new FormControl(mockExistingCompanyCandidate, [Validators.required])
  });
}

function generateMockNewCompanyForm(): FormGroup {
  return new FormGroup({
    'reason': new FormControl('MockReason', [PfValidators.required]),
    'companyName': new FormControl('MockJobTitle', [PfValidators.required, Validators.minLength(3)],
      [mockCompanyNameValidator()]),
    'industry': new FormControl('MockIndustry'),
    'contactName': new FormControl('MockContactName', [PfValidators.required]),
    'contactJobTitle': new FormControl('MockContactJobTitle'),
    'contactEmailAddress': new FormControl('MockContactEmailAddress@Mock.com', [Validators.email]),
    'contactPhoneNumber': new FormControl('555-555-5555')
  });
}
function mockCompanyNameValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors> => {
    return of(null);
  };
}
