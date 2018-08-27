import { TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { generateMockDataCutValidationInfo, generateMockExchangeStatCompanyMakeup } from 'libs/models/peer';
import * as fromRootState from 'libs/state/state';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';

import { DojGuidelinesService } from './doj-guidelines.service';
import * as fromLegacyAddPeerDataReducer from '../reducers';

describe('Legacy Content - Peer - DOJ Guidelines Service', () => {
  let service: DojGuidelinesService;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_peerMap: combineReducers(fromPeerMapReducer.reducers),
          legacy_upsertPeerData: combineReducers(fromLegacyAddPeerDataReducer.reducers)
        })
      ],
      providers: [
        DojGuidelinesService
      ]
    });

    store = TestBed.get(Store);
    service = TestBed.get(DojGuidelinesService);
  });

  it('should return false for hasMinimumCompanies when receiving less than the minCompanies', () => {
    service.companies = [generateMockExchangeStatCompanyMakeup()];

    expect(service.hasMinimumCompanies).toBe(false);

    expect(service.passesGuidelines).toBe(false);
  });

  it('should return true for hasMinimumCompanies when receiving >= to the minCompanies', () => {
    service.companies = Array(5).fill(generateMockExchangeStatCompanyMakeup());

    expect(service.hasMinimumCompanies).toBe(true);
  });

  it('should return false for hasNoDominatingData when there is no companies >= dominatingPercentage', () => {
    service.companies = [{...generateMockExchangeStatCompanyMakeup(), Percentage: 1}];

    expect(service.hasNoDominatingData).toBe(false);
  });

  it('should return true for hasNoDominatingData when there is companies < dominatingPercentage', () => {
    service.companies = [generateMockExchangeStatCompanyMakeup()];

    expect(service.hasNoDominatingData).toBe(true);

    expect(service.passesGuidelines).toBe(false);
  });

  it('should return company and formatted percentages for dominatingCompanies when there is companies >= dominatingPercentage', () => {
    const companyNameAndPercentage = {
      Company: 'MockCompany',
      Percentage: 55
    };

    service.companies = [
      generateMockExchangeStatCompanyMakeup(),
      { ...generateMockExchangeStatCompanyMakeup(), Percentage: .55 }
    ];

    expect(service.dominatingCompanies).toEqual([companyNameAndPercentage]);
  });


  it('should expect validDataCut to be true when the lists are not similar', () => {
    const dataValidationInfo = [generateMockDataCutValidationInfo()];
    const filterSelections = { CompanyIds: [1, 2, 3, 4, 5, 6, 7] };

    service.dataCutValidationInfo = dataValidationInfo;

    service.validateDataCut(filterSelections, true);

    expect(service.validDataCut).toBe(true);
  });

  it('should expect validDataCut to be false when the lists are too similar', () => {
    const dataValidationInfo = [generateMockDataCutValidationInfo()];
    const filterSelections = { CompanyIds: [1, 2, 3, 4, 5, 6] };

    service.dataCutValidationInfo = dataValidationInfo;

    service.validateDataCut(filterSelections, true);

    expect(service.validDataCut).toBe(false);

    expect(service.passesGuidelines).toBe(false);
  });

  it('should expect validDataCut to be true when the lists are too similar and shouldCheckSimilarity is false', () => {
    const dataValidationInfo = [generateMockDataCutValidationInfo()];
    const filterSelections = { CompanyIds: [1, 2, 3, 4, 5, 6] };
    const mockShouldCheckSimilarity = false;

    service.dataCutValidationInfo = dataValidationInfo;

    service.validateDataCut(filterSelections, mockShouldCheckSimilarity);

    expect(service.validDataCut).toBe(true);
  });
});
