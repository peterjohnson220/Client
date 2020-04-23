import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/internal/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { generateMockExchangeMapResponse, generateMockExchangeStatCompanyMakeup } from 'libs/models/peer';
import { SettingsService } from 'libs/state/app-context/services';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';

import * as fromUpsertDataCutActions from '../../../actions/upsert-data-cut-page.actions';
import * as fromLegacyAddPeerDataReducer from '../../../reducers';
import { UpsertDataCutPageComponent } from './upsert-data-cut.page';
import * as fromRequestPeerAccessActions from '../../../actions/request-peer-access.actions';

class DojGuidelinesStub {
  passing = true;

  get passesGuidelines(): boolean {
    return this.passing;
  }

  validateDataCut(selections: any) {
    return;
  }
}

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Legacy Content - Peer - Upsert Data Cut', () => {
  let fixture: ComponentFixture<UpsertDataCutPageComponent>;
  let instance: UpsertDataCutPageComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRouteStub;
  let guidelinesService: DojGuidelinesStub;
  const mockDataCutGUID = 'MockCutGUID';
  const queryStringParams = { companyPayMarketId: 1, companyJobId: 2, userSessionId: 3, dataCutGuid: null };

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
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: (key) => queryStringParams[key] } }
          }
        },
        { provide: DojGuidelinesService, useClass: DojGuidelinesStub },
        { provide: SettingsService, useClass: SettingsService }
      ],
      declarations: [
        UpsertDataCutPageComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);
    guidelinesService = TestBed.get(DojGuidelinesService);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UpsertDataCutPageComponent);
    instance = fixture.componentInstance;

    instance.untaggedIncumbentCount$ = of(0);
    instance.hasRequestedPeerAccess$ = of(false);
    instance.hasAcceptedPeerTerms$ = of(true);
  });

  it('should display the upsert data cut page with an Add button', () => {
    queryStringParams.dataCutGuid = null;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display the upsert data cut page with an Update button', () => {
    queryStringParams.dataCutGuid = mockDataCutGUID;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the LoadSystemFilter action on init when dataCutGuid param is null', () => {
    queryStringParams.dataCutGuid = null;
    const expectedAction = (new fromFilterSidebarActions.LoadSystemFilter({
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId
    }));

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the LoadDataCutDetails action on init when dataCutGuid param is NOT null', () => {
    queryStringParams.dataCutGuid = mockDataCutGUID;
    const expectedAction = (new fromUpsertDataCutActions.LoadDataCutDetails(queryStringParams.dataCutGuid));

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the LoadDataCutValidation action on init', () => {
    const expectedAction = (new fromDataCutValidationActions.LoadDataCutValidation({
      CompanyJobId: queryStringParams.companyJobId,
      UserSessionId: queryStringParams.userSessionId
    }));

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the upsert data cut action when clicking add', () => {
    queryStringParams.dataCutGuid = null;
    const expectedAction = new fromUpsertDataCutActions.UpsertDataCut({
      DataCutGuid: queryStringParams.dataCutGuid,
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId,
      IsPayMarketOverride: false,
      UserSessionId: queryStringParams.userSessionId,
      ZoomLevel: 0
    });

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the upsert data cut action when clicking update', () => {
    queryStringParams.dataCutGuid = mockDataCutGUID;
    const expectedAction = new fromUpsertDataCutActions.UpsertDataCut({
      DataCutGuid: queryStringParams.dataCutGuid,
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId,
      IsPayMarketOverride: false,
      UserSessionId: queryStringParams.userSessionId,
      ZoomLevel: 0
    });

    fixture.detectChanges();
    instance.upsert();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the cancel action when clicking cancel', () => {
    const expectedAction = new fromUpsertDataCutActions.CancelUpsertDataCut();

    instance.cancel();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should enable the add button when passesGuidelines is true', () => {
    const mapResponse = generateMockExchangeMapResponse();

    queryStringParams.dataCutGuid = null;
    mapResponse.MapSummary.OverallMapStats.CompanyCount = 5;

    store.dispatch(new fromPeerMapActions.LoadPeerMapDataSuccess(mapResponse));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the update button when passesGuidelines is true', () => {
    queryStringParams.dataCutGuid = mockDataCutGUID;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should call validateDataCut when map summary changes changes', () => {
    const payload = generateMockExchangeStatCompanyMakeup();
    queryStringParams.dataCutGuid = null;
    instance.peerMapCompanies$ = of(payload);

    spyOn(guidelinesService, 'validateDataCut');

    fixture.detectChanges();
    expect(guidelinesService.validateDataCut).toHaveBeenCalledWith(payload, 2, 3);
  });

  it('should disable the add/updated button when passesGuidelines is false', () => {
    queryStringParams.dataCutGuid = null;
    guidelinesService.passing = false;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should display untagged incumbents filter when untaggedIncumbentCount$ > 0`, () => {
    instance.includeUntaggedIncumbents$ = of(false);
    instance.untaggedIncumbentCount$ = of(1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch a ToggleIncludeUntaggedEmployees action when handleUntaggedIncumbentsChecked is called`, () => {
    const expectedAction = new fromFilterSidebarActions.ToggleIncludeUntaggedEmployees();

    instance.includeUntaggedIncumbents$ = of(false);
    instance.untaggedIncumbentCount$ = of(1);

    fixture.detectChanges();

    instance.handleUntaggedIncumbentsChecked();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch a RequestAccess action when requestAccess is called`, () => {
    const expectedAction = new fromRequestPeerAccessActions.RequestPeerAccess();

    fixture.detectChanges();

    instance.requestPeerAccess();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should show 'Request Access' button and message when peer terms haven't been accepted`, () => {
    instance.hasAcceptedPeerTerms$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show disabled 'Requesting Access' button when peer terms haven't been accepted and access
  is being requested`, () => {
      instance.hasAcceptedPeerTerms$ = of(false);
      instance.requestingPeerAccess$ = of(true);

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });

  it(`should show disabled 'Access Requested' button and 'Access Requested' message when
  peer terms haven't been accepted and access has been requested`, () => {
      instance.hasAcceptedPeerTerms$ = of(false);
      instance.hasRequestedPeerAccess$ = of(true);

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
    });
});
