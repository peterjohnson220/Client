import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { of } from 'rxjs';

import { PfCommonModule } from 'libs/core';
import * as fromRootState from 'libs/state/state';
import { RateType } from 'libs/data/data-sets';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';

import { SummaryCardComponent } from './summary.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import { ComphubPages } from '../../../data';
import {
  generateFakeJobData,
  generateMockCountryDataSet,
  generateMockPricingPaymarket,
  generateMockWorkflowContext
} from '../../../models';

describe('Comphub - Main - Summary Card Component', () => {
  let instance: SummaryCardComponent;
  let fixture: ComponentFixture<SummaryCardComponent>;
  let store: Store<fromComphubMainReducer.State>;
  let currencyPipe: CurrencyPipe;
  let exchangeExplorerContextService: ExchangeExplorerContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        }),
        // Bad. Using actual implementation to verify calls.
        PDFExportModule,
        PfCommonModule
      ],
      declarations: [ SummaryCardComponent ],
      providers: [
        {
          provide: CurrencyPipe,
          useValue: { transform: (x) => x }
        },
        {
          provide: ExchangeExplorerContextService,
          useValue: { selectFilterContext: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SummaryCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    currencyPipe = TestBed.inject(CurrencyPipe);
    exchangeExplorerContextService = TestBed.inject(ExchangeExplorerContextService);

    fixture.detectChanges();

    instance.workflowContext = {
      ...generateMockWorkflowContext(),
      selectedPageId: ComphubPages.Summary
    };
  });

  it('should dispatch a PriceNewJob action, when handling a Price New Job click', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSummaryCardActions.PriceNewJob();

    instance.handlePriceNewJobClicked();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should return correct value when selected rate is hourly', () => {
    const value = 360100;
    const expectedValue = 173.13;
    instance.selectedRate = RateType.Hourly;

    const actualValue = Math.round(instance.calculateDataByRate(value) * 100) / 100;

    expect(actualValue).toEqual(expectedValue);
  });

  it('should return correct value when selected rate is annual', () => {
    const value = 360100;
    const expectedValue = 360100;
    instance.selectedRate = RateType.Annual;

    const actualValue = instance.calculateDataByRate(value);

    expect(actualValue).toEqual(expectedValue);
  });

  it('should call saveAs on the pdf export view child when handleDownloadPdfClicked clicked', () => {
    spyOn(instance.pdf, 'saveAs');
    instance.jobData = generateFakeJobData();

    instance.handleDownloadPdfClicked();

    expect(instance.pdf.saveAs).toHaveBeenCalled();
  });

  it('should call saveAs with the correct fileName on the pdf export view child when handleDownloadPdfClicked clicked', () => {
    spyOn(instance.pdf, 'saveAs');
    instance.jobData = {...generateFakeJobData(), JobTitle: 'This is a job title with spaces'};
    const expectedFileName = 'PricingSummaryForThisisajobtitlewithspaces.pdf';

    instance.handleDownloadPdfClicked();

    expect(instance.pdf.saveAs).toHaveBeenCalledWith(expectedFileName);
  });

  it('should remove periods from job title when saving pdf', () => {
    spyOn(instance.pdf, 'saveAs');
    instance.jobData = {...generateFakeJobData(), JobTitle: 'Job.Title.III.Boy'};
    const expectedFileName = 'PricingSummaryForJobTitleIIIBoy.pdf';

    instance.handleDownloadPdfClicked();

    expect(instance.pdf.saveAs).toHaveBeenCalledWith(expectedFileName);
  });

  it('should dispatch OpenShareModal when Share button clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSummaryCardActions.OpenShareModal();

    instance.handleShareClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch CloseShareModal when Cancel button from share modal clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSummaryCardActions.CloseShareModal();

    instance.handleShareModalCancelClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch CreateProject when create project button clicked', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromSummaryCardActions.CreateProject();

    instance.handleCreateProjectClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should hide create project button when no access to projects tile', () => {
    spyOn(store, 'dispatch');

    instance.paymarket = generateMockPricingPaymarket();
    instance.canAccessProjectsTile$ = of(false);
    instance.firstDayOfMonth = new Date(2019, 2, 1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show create project button when has access to projects tile', () => {
    spyOn(store, 'dispatch');

    instance.paymarket = generateMockPricingPaymarket();
    instance.canAccessProjectsTile$ = of(true);
    instance.firstDayOfMonth = new Date(2019, 2, 1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide create project button has access to projects tile but no paymarketId', () => {
    spyOn(store, 'dispatch');

    instance.paymarket = generateMockPricingPaymarket();
    instance.paymarket.CompanyPayMarketId = null;
    instance.canAccessProjectsTile$ = of(true);
    instance.firstDayOfMonth = new Date(2019, 2, 1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch load job trend chart when selected page is Summary and job data has been changed', () => {
    spyOn(store, 'dispatch');

    instance.selectedJobData$ = of({...generateFakeJobData(), JobId: 3});
    instance.lastJobData = generateFakeJobData();
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Summary});
    instance.ngOnInit();

    const getNationalJobTrendDataAction = new fromSummaryCardActions.GetNationalJobTrendData(instance.jobData);

    expect(store.dispatch).toHaveBeenCalledWith(getNationalJobTrendDataAction);
  });

  it('should NOT dispatch load job trend chart when selected page is Summary and job data has NOT been changed', () => {
    spyOn(store, 'dispatch');

    instance.selectedJobData$ = of(generateFakeJobData());
    instance.lastJobData = generateFakeJobData();
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Summary});
    instance.ngOnInit();

    const getNationalJobTrendDataAction = new fromSummaryCardActions.GetNationalJobTrendData(instance.jobData);

    expect(store.dispatch).not.toHaveBeenCalledWith(getNationalJobTrendDataAction);
  });

  it('should NOT dispatch load job trend chart and add new completed pricing record ' +
  'when selected page is NOT Summary and job data has been changed', () => {
    spyOn(store, 'dispatch');

    instance.selectedJobData$ = of({...generateFakeJobData(), JobId: 3});
    instance.lastJobData = generateFakeJobData();
    instance.workflowContext$ = of({...generateMockWorkflowContext(), selectedPageId: ComphubPages.Markets});
    instance.ngOnInit();

    const getNationalJobTrendDataAction = new fromSummaryCardActions.GetNationalJobTrendData(instance.jobData);

    expect(store.dispatch).not.toHaveBeenCalledWith(getNationalJobTrendDataAction);
  });

  it('should display USD for currency when active market data is USA', () => {
    instance.firstDayOfMonth = new Date(2019, 2, 1);
    instance.workflowContext.activeCountryDataSet = {
      ...generateMockCountryDataSet(),
      CountryCode: 'USA',
      CurrencyCode: 'USD'
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display CAD for currency when active market data is Canada', () => {
    instance.firstDayOfMonth = new Date(2019, 2, 1);
    instance.workflowContext.activeCountryDataSet = {
      ...generateMockCountryDataSet(),
      CountryCode: 'CAN',
      CurrencyCode: 'CAD'
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  it('should display min wage when available', () => {
    instance.firstDayOfMonth = new Date(2019, 2, 1);
    instance.minPaymarketMinimumWage$ = of(7.25);
    instance.maxPaymarketMinimumWage$ = of(7.25);
    instance.workflowContext.activeCountryDataSet = {
      ...generateMockCountryDataSet(),
      CountryCode: 'USA',
      CurrencyCode: 'USD'
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

  });

  it('should display min wage range if min and max are different', () => {
    instance.firstDayOfMonth = new Date(2019, 2, 1);
    instance.minPaymarketMinimumWage$ = of(7.25);
    instance.maxPaymarketMinimumWage$ = of(11.50);
    instance.workflowContext.activeCountryDataSet = {
      ...generateMockCountryDataSet(),
      CountryCode: 'USA',
      CurrencyCode: 'USD'
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display - as the min wage when there is no wage data', () => {
    instance.firstDayOfMonth = new Date(2019, 2, 1);
    instance.minPaymarketMinimumWage$ = of(null);
    instance.maxPaymarketMinimumWage$ = of(null);
    instance.workflowContext.activeCountryDataSet = {
      ...generateMockCountryDataSet(),
      CountryCode: 'USA',
      CurrencyCode: 'USD'
    };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
