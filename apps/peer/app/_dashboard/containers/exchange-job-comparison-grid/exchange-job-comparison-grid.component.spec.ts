import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import { GridTypeEnum, ExchangeJobComparison, generateMockExchangeJobComparison } from 'libs/models';
import { generateMockDataStateChangeEvent, generateMockSelectionEvent } from 'libs/extensions/kendo/mocks';
import { SettingsService } from 'libs/state/app-context/services';
import { generateMockRateOption, generateMockWeightOption, RateType } from 'libs/data/data-sets';

import * as fromExchangeJobComparisonGridActions from '../../actions/exchange-job-comparison-grid.actions';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeJobComparisonGridComponent } from './exchange-job-comparison-grid.component';

describe('Peer - Exchange Job Comparison Grid', () => {
  let fixture: ComponentFixture<ExchangeJobComparisonGridComponent>;
  let instance: ExchangeJobComparisonGridComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeJobComparisonGridComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {provide: SettingsService, useValue: {selectUiPersistenceSetting: jest.fn()}}
      ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(ExchangeJobComparisonGridComponent);
    instance = fixture.componentInstance;

    const mockJobComparison: ExchangeJobComparison = generateMockExchangeJobComparison();
    const gridDataResult: GridDataResult = {data: [mockJobComparison], total: 1};
    instance.exchangeJobComparisonsGridData$ = of(gridDataResult);
    instance.selectedKeys = [1];
    instance.exchangeJobOrgsDetailVisible$ = of(false);
    instance.persistedComparisonGridMarket$ = of('USA');
    instance.persistedComparisonGridRate$ = of(generateMockRateOption().Value);
    instance.persistedComparisonGridWeightType$ = of(generateMockWeightOption().Value);

    fixture.detectChanges();
  });

  it('should dispatch an UpdateGrid action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent('CompanyJobTitle');
    const expectedAction = new fromGridActions.UpdateGrid(GridTypeEnum.ExchangeJobComparison, mockGridState);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadExchangeJobComparisons action when handleDataStateChange is called', () => {
    const mockGridState = generateMockDataStateChangeEvent('CompanyJobTitle');
    const expectedAction = new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({countryCode: 'USA'});

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleDataStateChange(mockGridState);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadExchangeJobComparisons action when handleMarketFilterChanged is called', () => {
    const expectedAction = new fromExchangeJobComparisonGridActions.LoadExchangeJobComparisons({countryCode: 'ALL'});

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleMarketFilterChanged('ALL');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should return value with % as string when getExchangeIndexValue is called', () => {
    const expected = '100%';
    const mockExchangeIndex = 100.00;

    const actual = instance.getExchangeIndexValue(mockExchangeIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-success" string when getExchangeIndexFontColorClass is called with an index >= 100', () => {
    const expected = 'text-success';
    const mockIndex = 101;

    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it('should return "text-warning" string when getExchangeIndexFontColorClass is called with an index < 50', () => {
    const expected = 'text-warning';
    const mockIndex = 49;
    const actual = instance.getExchangeIndexFontColorClass(mockIndex);

    expect(actual).toBe(expected);
  });

  it(`should clear selectedKeys when exchangeJobOrgsDetailVisible$ is false`, () => {
    const expectedKeys = [];

    expect(instance.selectedKeys).toEqual(expectedKeys);
  });

  it(`should NOT dispatch a LoadExchangeJobOrgs action when onSelectionChange is triggered and there are no selections`, () => {
    const mockSelectionEvent = {...generateMockSelectionEvent(generateMockExchangeJobComparison()), selectedRows: []};

    spyOn(store, 'dispatch');

    instance.onSelectionChange(mockSelectionEvent);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it(`should dispatch a LoadExchangeJobOrgs action when onSelectionChange is triggered and there are selections`, () => {
    const mockExchangeJobComparison = generateMockExchangeJobComparison();
    const expectedAction = new fromExchangeDashboardActions.LoadExchangeJobOrgs({
      selectedExchangeJobComparison: mockExchangeJobComparison,
      selectedMarket: 'USA'
    });

    spyOn(store, 'dispatch');

    instance.onSelectionChange(generateMockSelectionEvent(generateMockExchangeJobComparison()));

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should use a 2 decimal format for digit info when the selectedRate is hourly`, () => {
    const expectedHourlyFormat = '1.2-2';
    instance.selectedRate = {Name: RateType.Hourly, Value: RateType.Hourly};

    fixture.detectChanges();

    expect(instance.digitsInfo).toBe(expectedHourlyFormat);
  });

  it(`should use a 1 decimal format for digit info when the selectedRate is annual`, () => {
    const expectedHourlyFormat = '1.1-1';

    fixture.detectChanges();

    expect(instance.digitsInfo).toBe(expectedHourlyFormat);
  });

  it(`should format companyBaseAverageField as hourly when the selectedRate is hourly`, () => {
    const expected = 'HourlyCompanyBaseAverage';
    instance.selectedRate = {Name: RateType.Hourly, Value: RateType.Hourly};

    fixture.detectChanges();

    expect(instance.companyBaseAverageField).toBe(expected);
  });

  it(`should format companyBaseAverageField as annual when the selectedRate is annual`, () => {
    const expected = 'CompanyBaseAverage';

    fixture.detectChanges();

    expect(instance.companyBaseAverageField).toBe(expected);
  });

  it(`should format exchangeBaseAverageField as hourly when the selectedRate is hourly`, () => {
    const expected = 'HourlyExchangeBaseAverage';
    instance.selectedRate = {Name: RateType.Hourly, Value: RateType.Hourly};

    fixture.detectChanges();

    expect(instance.exchangeBaseAverageField).toBe(expected);
  });

  it(`should format exchangeBaseAverageField as annual when the selectedRate is annual`, () => {
    const expected = 'ExchangeBaseAverage';

    fixture.detectChanges();

    expect(instance.exchangeBaseAverageField).toBe(expected);
  });

});
