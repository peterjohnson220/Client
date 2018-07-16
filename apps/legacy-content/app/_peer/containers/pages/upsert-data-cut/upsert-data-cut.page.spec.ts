import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';
import { generateMockExchangeMapResponse } from 'libs/models/peer';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';

import * as fromUpsertDataCutActions from '../../../actions/upsert-data-cut-page.actions';
import * as fromLegacyAddPeerDataReducer from '../../../reducers';
import { UpsertDataCutPageComponent } from './upsert-data-cut.page';

describe('Legacy Content - Peer - Upsert Data Cut', () => {
  let fixture: ComponentFixture<UpsertDataCutPageComponent>;
  let instance: UpsertDataCutPageComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRouteStub;
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
        }
      ],
      declarations: [
        UpsertDataCutPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(UpsertDataCutPageComponent);
    instance = fixture.componentInstance;
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

  it('should dispatch the upsert data cut action when clicking add', () => {
    queryStringParams.dataCutGuid = null;
    const expectedAction = new fromUpsertDataCutActions.UpsertDataCut({
      DataCutGuid: queryStringParams.dataCutGuid,
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId,
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

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should enable the add button when the map data contains more than the MinCompanies', () => {
    const mapResponse = generateMockExchangeMapResponse();

    queryStringParams.dataCutGuid = null;
    mapResponse.MapSummary.OverallMapStats.CompanyCount = 5;

    store.dispatch(new fromPeerMapActions.LoadPeerMapDataSuccess(mapResponse));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should enable the update button when the map data contains more than the MinCompanies', () => {
    const mapResponse = generateMockExchangeMapResponse();

    queryStringParams.dataCutGuid = mockDataCutGUID;
    mapResponse.MapSummary.OverallMapStats.CompanyCount = 5;

    store.dispatch(new fromPeerMapActions.LoadPeerMapDataSuccess(mapResponse));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
