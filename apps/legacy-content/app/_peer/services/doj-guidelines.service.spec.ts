import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { generateMockExchangeStatCompanyMakeup } from 'libs/models/peer';
import {DojGuidelinesService} from './doj-guidelines.service';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import * as fromRootState from '../../../../../libs/state/state';
import * as fromPeerMapReducer from '../../../../../libs/features/peer/map/reducers';
import * as fromLegacyAddPeerDataReducer from '../reducers';
import {ActivatedRoute} from '@angular/router';
import {UpsertDataCutPageComponent} from '../containers/pages/upsert-data-cut';

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
});
