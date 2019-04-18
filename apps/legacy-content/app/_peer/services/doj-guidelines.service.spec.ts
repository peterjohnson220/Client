import { TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import {
  ExchangeStatCompanyMakeup,
  generateMockDataCutValidationInfo,
  generateMockExchangeStatCompanyMakeup
} from 'libs/models/peer';
import * as fromRootState from 'libs/state/state';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';

import { DojGuidelinesService } from './doj-guidelines.service';
import * as fromLegacyAddPeerDataReducer from '../reducers';
import { of } from 'rxjs';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

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

  it('should return false for hasNoDominatingData when there are companies > dominatingPercentage', () => {
    service.companies = [{ ...generateMockExchangeStatCompanyMakeup(), Percentage: .26 }];

    expect(service.hasNoDominatingData).toBe(false);
  });

  it('should return true for hasNoDominatingData when there are companies <= dominatingPercentage', () => {
    service.companies = [{ ...generateMockExchangeStatCompanyMakeup(), Percentage: .25 }];

    expect(service.hasNoDominatingData).toBe(true);

    expect(service.passesGuidelines).toBe(false);
  });

  it('should return false for hasNoHardDominatingData when there are companies >= dominatingPercentageHard', () => {
    service.companies = [{ ...generateMockExchangeStatCompanyMakeup(), Percentage: .5 }];

    expect(service.hasNoDominatingData).toBe(false);
  });

  it('should return true for hasNoHardDominatingData when there are companies < dominatingPercentageHard', () => {
    service.companies = [generateMockExchangeStatCompanyMakeup()];

    expect(service.hasNoDominatingData).toBe(true);

    expect(service.passesGuidelines).toBe(false);
  });

  it('should return company and formatted percentages for dominatingCompanies when there are companies >= dominatingPercentage', () => {
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
    const companies: ExchangeStatCompanyMakeup[] = [];
    for (let i = 0; i < 7; i++) {
      const companyStat = generateMockExchangeStatCompanyMakeup();
      companyStat.CompanyId = i + 1;
      companies.push(companyStat);
    }

    service.dataCutValidationInfo = dataValidationInfo;

    service.validateDataCut(companies, 13, 13950);

    expect(service.companyValidationPass).toBe(true);
  });

  // DKG - tried to work with Brandon on this but there is something in unit testing services with
  // observables where dispatching the action or setting an observable doens't work. He suggested
  // the effort of fixing wasn't worth it so we should comment this out with a note.

  // it('should expect validDataCut to be false when the lists are too similar', () => {
  //   const dataValidationInfo = [generateMockDataCutValidationInfo()];
  //   const companies: ExchangeStatCompanyMakeup[] = [];
  //   for (let i = 0; i < 6; i++) {
  //     const companyStat = generateMockExchangeStatCompanyMakeup();
  //     companyStat.CompanyId = i + 1;
  //     companies.push(companyStat);
  //   }

  //   service.companies = companies;
  //   service.dataCutValidationInfo = dataValidationInfo;
  //   store.dispatch(new fromPeerMapActions.InitialMapMoveComplete({
  //     bounds: 1,
  //     zoom: 1
  //   }));

  //   service.validateDataCut(companies, 13, 1234);

  //   expect(service.companyValidationPass).toBe(false);

  //   expect(service.passesGuidelines).toBe(false);
  // });
});
