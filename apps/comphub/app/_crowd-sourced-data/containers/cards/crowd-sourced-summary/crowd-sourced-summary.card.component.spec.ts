import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { GetCrowdSourcedJobPricingRequest } from 'libs/models/payfactors-api';
import { RateType } from 'libs/data/data-sets';

import { CrowdSourcedSummaryCardComponent } from './crowd-sourced-summary.card.component';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { generateMockCrowdSourcedWorkflowContext, generateMockMarketDataScope } from '../../../../_shared/models';
import * as fromDataCardActions from '../../../../_shared/actions/data-card.actions';

describe('Comphub - Crowd Sourced Data - Summary Card Component', () => {
  let instance: CrowdSourcedSummaryCardComponent;
  let fixture: ComponentFixture<CrowdSourcedSummaryCardComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
          comphub_crowd_sourced: combineReducers(fromComphubSharedReducer.reducers)
        }),
        DropDownsModule,
      ],
      declarations: [ CrowdSourcedSummaryCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CrowdSourcedSummaryCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);

    instance.marketDataScope = generateMockMarketDataScope();
    instance.workflowContext = generateMockCrowdSourcedWorkflowContext();
    instance.selectedJob = {
      JobTitle: 'Test Engineer',
      JobId: null,
      JobCode: null,
      JobDescription: null,
      Education: null,
      YearsOfExperience: '0',
      ManagesEmployees: false,
      ShowJd: false,
      Skills: null,
      FLSAStatus: null,
      Base10: 10000,
      Base25: 20000,
      Base50: 30000,
      Base75: 40000,
      Base90: 50000,
      BaseAvg: 35000,
      Tcc10: 11000,
      Tcc25: 21000,
      Tcc50: 31000,
      Tcc75: 41000,
      Tcc90: 51000,
      TccAvg: 36000};
    instance.selectedPaymarket = {
      CompanyPayMarketId: 1,
      CountryCode: 'USA',
      PayMarketName: 'Mock Pay Market',
      Industry: null,
      Location: 'Boston, MA',
      SizeLabel: 'Employees',
      Size: '100 - 500',
      CurrencyCode: 'USD',
      OrganizationTypeId: 1
    };
    instance.selectedDisplayRate = '50';
    instance.selectedRate = RateType.Annual;

  });

  it('should dispatch SetSelectedRate action and re-map job data when rate selection changes', () => {
    jest.spyOn(store, 'dispatch');
    const selectedRateType = RateType['Annual'];
    const expectedAction = new fromDataCardActions.SetSelectedRate(selectedRateType);

    // change one of the values on the selected job, make sure the change takes
    instance.selectedJob.Base10 = 15000;
    instance.handleRateSelectionChange({ Value: 'Annual', Name: 'Annual' });
    // fixture.detectChanges();

    expect(instance.basePayGraph.Pay10).toEqual(15);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


  it('should dispatch an action to get the updated pay report including the paymarket, when getInitialPricing is called', () => {
    jest.spyOn(store, 'dispatch');

    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: 'Test Engineer',
      Country: 'United States',
      PaymarketId: 1,
      SelectedFactors: [],
      IncludeExportData: true
    };

    const expectedAction = new fromJobGridActions.GetCrowdSourcedJobPricing(request);
    instance.getInitialPricing();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should correctly parse the selected job values when mapping job data to pay graph, and set the selected values', () => {

    expect(instance.basePayGraph).toBeUndefined();
    expect(instance.tccPayGraph).toBeUndefined();

    instance.mapJobDataToPayGraphData();

    // quick check to make sure the values got in properly
    expect(instance.basePayGraph).not.toBeUndefined();
    expect(instance.tccPayGraph).not.toBeUndefined();

  });

  it('should display the same value differently depending on the rate', () => {
    instance.selectedRate = RateType.Annual;

    const value = 100000;

    expect(instance.calculateDataByRate(value)).toEqual(100);

    instance.selectedRate = RateType.Hourly;

    expect(instance.calculateDataByRate(value)).toEqual(value / 2080);
  });

});
