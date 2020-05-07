import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { of } from 'rxjs/internal/observable/of';

import * as fromRootState from 'libs/state/state';
import { generateMockGenericKeyValue, GenericKeyValue } from 'libs/models/common';
import * as fromAssociateJobsActions from 'libs/features/peer/job-association-match/actions/associate-jobs.actions';

import { ExchangeJobAssociationUtilityPageComponent } from './exchange-job-association-utility.page';
import * as fromCompanyOptionsActions from '../../../actions/exchange-job-association-utility/company-options.actions';
import * as fromExchangeOptionsActions from '../../../actions/exchange-job-association-utility/exchange-options.actions';
import * as fromPeerAdminReducer from '../../../reducers';

describe('Admin - Exchange Job Association Utility Page', () => {
  let fixture: ComponentFixture<ExchangeJobAssociationUtilityPageComponent>;
  let instance: ExchangeJobAssociationUtilityPageComponent;
  let store: Store<fromRootState.State>;

  const mockGenericKeyValue = generateMockGenericKeyValue<number, string>(1, 'One');

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule,
        DropDownsModule
      ],
      declarations: [
        ExchangeJobAssociationUtilityPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeJobAssociationUtilityPageComponent);
    instance = fixture.componentInstance;
    instance.exchangeOptions$ = of([]);
    instance.companyOptions$ = of([]);
  });

  it(`should dispatch LoadCompanyOptions action on init`, () => {
    const expectedAction = new fromCompanyOptionsActions.LoadCompanyOptions();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should only have 10 filteredCompanyOptions`, () => {
    const expectedNumberOfFilteredCompanyOptions = 10;
    instance.companyOptions$ = of(generateMockOptions(11));

    fixture.detectChanges();

    expect(instance.companyOptionsFiltered.length).toBe(expectedNumberOfFilteredCompanyOptions);
  });

  it(`should only have 10 filteredCompanyOptions after handleCompanyFilterChange is triggered`, () => {
    const expectedNumberOfFilteredExchangeOptions = 10;
    instance.companyOptions$ = of(generateMockOptions(22));

    fixture.detectChanges();

    instance.handleCompanyFilterChange('1');

    fixture.detectChanges();

    expect(instance.companyOptionsFiltered.length).toBe(expectedNumberOfFilteredExchangeOptions);
  });

  it(`should filter companyOptions when handleCompanyFilterChange is triggered`, () => {
    const expectedFilteredCompanyOptionsLength = 1;
    instance.companyOptions$ = of(generateMockOptions(10));

    fixture.detectChanges();

    instance.handleCompanyFilterChange('2');

    fixture.detectChanges();

    expect(instance.companyOptionsFiltered.length).toBe(expectedFilteredCompanyOptionsLength);
  });

  it(`should filter exchangeOptions when handleExchangeFilterChange is triggered`, () => {
    const expectedFilteredExchangeOptionsLength = 1;
    instance.exchangeOptions$ = of(generateMockOptions(10));

    fixture.detectChanges();

    instance.handleExchangeFilterChange('2');

    fixture.detectChanges();

    expect(instance.exchangeOptionsFiltered.length).toBe(expectedFilteredExchangeOptionsLength);
  });

  it(`should toggle companyOptions combobox off when handleCompanyFilterChange is triggered and no options meet the
  criteria`, () => {
    const expectedToggleValue = false;

    instance.companyOptions$ = of(generateMockOptions(10));

    fixture.detectChanges();

    spyOn(instance.companyList, 'toggle');

    instance.handleCompanyFilterChange('11');

    fixture.detectChanges();

    expect(instance.companyList.toggle).toBeCalledWith(expectedToggleValue);
  });

  it(`should toggle exchangeOptions combobox off when handleExchangeFilterChange is triggered and no options meet the
  criteria`, () => {
    const expectedToggleValue = false;

    instance.exchangeOptions$ = of(generateMockOptions(10));

    fixture.detectChanges();

    spyOn(instance.exchangeList, 'toggle');

    instance.handleExchangeFilterChange('11');

    fixture.detectChanges();

    expect(instance.exchangeList.toggle).toBeCalledWith(expectedToggleValue);
  });

  it(`should display 'Run' button as disabled on init`, () => {
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;
    const runButton = html.querySelector('button');
    expect(runButton).toMatchSnapshot();
  });

  it(`should NOT display 'Run' button as disabled when there is both an exchangeSelection and companySelection`, () => {
    fixture.detectChanges();

    instance.companySelectionControl.setValue(mockGenericKeyValue.Key);
    instance.exchangeSelectionControl.setValue(mockGenericKeyValue.Key);

    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    const runButton = html.querySelector('button');
    expect(runButton).toMatchSnapshot();
  });

  it(`should trigger an AssociateJobs action when the 'Run' button is clicked`, () => {
    const expectedPayload = {
      CompanyId: mockGenericKeyValue.Key,
      ExchangeId: mockGenericKeyValue.Key
    };
    const expectedAction = new fromAssociateJobsActions.AssociateJobs(expectedPayload);

    fixture.detectChanges();

    instance.companySelectionControl.setValue(mockGenericKeyValue.Key);
    instance.exchangeSelectionControl.setValue(mockGenericKeyValue.Key);

    fixture.detectChanges();

    instance.handleRunButtonClick();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);

    expect(instance.hasAttemptedRun).toBe(true);
  });

  it(`should enable exchange selection combobox when companySelection is valid`, () => {
    fixture.detectChanges();

    instance.companySelectionControl.setValue(mockGenericKeyValue.Key);

    fixture.detectChanges();

    expect(instance.exchangeList.disabled).toBe(false);
  });

  it(`should reset the exchangeSelectionControl when handleCompanySelectionChange is triggered`, () => {
    fixture.detectChanges();

    spyOn(instance.exchangeSelectionControl, 'reset');

    instance.handleCompanySelectionChange(mockGenericKeyValue);

    fixture.detectChanges();

    expect(instance.exchangeSelectionControl.reset).toBeCalled();
  });

  it(`should dispatch a LoadExchangeOptions action when handleCompanySelectionChange is triggered and
  there is a selection`, () => {
    const expectedAction = new fromExchangeOptionsActions.LoadExchangeOptions(mockGenericKeyValue.Key);

    fixture.detectChanges();

    instance.handleCompanySelectionChange(mockGenericKeyValue);

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should NOT dispatch a LoadExchangeOptions action when handleCompanySelectionChange is triggered and
  there is no selection`, () => {
    const expectedAction = new fromExchangeOptionsActions.LoadExchangeOptions(mockGenericKeyValue.Key);

    fixture.detectChanges();

    instance.handleCompanySelectionChange(null);

    fixture.detectChanges();

    expect(store.dispatch).not.toBeCalledWith(expectedAction);
  });

  it(`should display success alert when not currently associating, a run has been attempted, and there was NO error`, () => {
    fixture.detectChanges();

    instance.autoAssociating$ = of(false);
    instance.autoAssociatingError$ = of(false);
    instance.hasAttemptedRun = true;

    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    const alert = html.querySelector('.alert');

    expect(alert).toMatchSnapshot();
  });

  it(`should display danger alert when not currently associating, a run has been attempted, and there was an error`, () => {
    fixture.detectChanges();

    instance.autoAssociating$ = of(false);
    instance.autoAssociatingError$ = of(true);
    instance.hasAttemptedRun = true;

    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;
    const alert = html.querySelector('.alert');

    expect(alert).toMatchSnapshot();
  });
});

function generateMockOptions(number: number): GenericKeyValue<number, string>[] {
  const options = [];
  for (let i = 1; i <= number; i++) {
    options.push(generateMockGenericKeyValue<number, string>(i, i.toString()));
  }

  return options;
}

