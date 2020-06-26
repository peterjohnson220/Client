import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromLibsRootState from 'libs/state/state';
import * as fromLibsFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromLibsPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';
import { generateMockExchange } from 'libs/models/peer';
import {
  generateMockUpsertExchangeScopeRequest,
  UpsertExchangeScopeRequest
} from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import { MapComponent } from 'libs/features/peer/map/containers/map';

import * as fromSharedPeerExchangeActions from '../../../../shared/actions/exchange.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import * as fromExchangeScopeActions from '../../../actions/exchange-scope.actions';
import { ExchangeMapPageComponent } from './exchange-map.page';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Peer - Map - Exchange Map Page', () => {
  const mockUpsertExchangeScopeRequest: UpsertExchangeScopeRequest = generateMockUpsertExchangeScopeRequest();
  let fixture: ComponentFixture<ExchangeMapPageComponent>;
  let instance: ExchangeMapPageComponent;
  let store: Store<fromLibsRootState.State>;
  let route: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromLibsRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          feature_peerMap: combineReducers(fromLibsPeerMapReducer.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        }
      ],
      declarations: [
        ExchangeMapPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeMapPageComponent);
    instance = fixture.componentInstance;
    instance.map = {getZoomLevel() { return mockUpsertExchangeScopeRequest.ZoomLevel; }} as MapComponent;
    instance.numberOfCompanySelections$ = of(0);
    instance.numberOfSelections$ = of(1);
    instance.peerMapCompaniesCount$ = of(5);
  });

  it('should show the exchange name as the page title', () => {
    store.dispatch(new fromSharedPeerExchangeActions.LoadExchangeSuccess(
      { exchange: generateMockExchange(), path: 'manage' }
    ));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LimitToExchange action upon Init with the routes exchange Id', () => {
    const expectedAction = new fromLibsFilterSidebarActions.LimitToExchange(route.snapshot.params.id);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadPeerMapData action upon Init', () => {
    const expectedAction = new fromLibsPeerMapActions.LoadPeerMapData();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


  it('should dispatch a Reset action to the filterSidebar upon destroy', () => {
    const expectedAction = new fromLibsFilterSidebarActions.ResetState();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a Reset action to the map upon destroy', () => {
    const expectedAction = new fromLibsPeerMapActions.ResetState();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an UpsertExchangeScope action when handleUpsertExchangeScopeEvent is triggered`, () => {
    const expectedAction = new fromExchangeScopeActions.UpsertExchangeScope({
      ExchangeScopeName: mockUpsertExchangeScopeRequest.ExchangeScopeName,
      ExchangeScopeDescription: mockUpsertExchangeScopeRequest.ExchangeScopeDescription,
      ZoomLevel: mockUpsertExchangeScopeRequest.ZoomLevel
    });

    fixture.detectChanges();

    instance.handleUpsertExchangeScopeEvent({
      Name: mockUpsertExchangeScopeRequest.ExchangeScopeName,
      Description: mockUpsertExchangeScopeRequest.ExchangeScopeDescription
    });

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an OpenSaveExchangeScopeModal action when handleSaveScopeClick is triggered`, () => {
    const expectedAction = new fromExchangeScopeActions.OpenSaveExchangeScopeModal();

    fixture.detectChanges();

    instance.handleSaveScopeClick();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should display a disabled Create Scope button when numberOfCompanySelections$ is > 0 and < 5', () => {
    instance.numberOfCompanySelections$ = of(1);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Create Scope button when numberOfSelections$ is  0', () => {
    instance.numberOfSelections$ = of(0);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Export Data Cuts Button when peerMapCompaniesCount$ is < 5', () => {
    instance.peerMapCompaniesCount$ = of(1);
    instance.exchangeJobIdsInScope$ = of([1]);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display a disabled Export Data Cuts Button when exchangeJobIdsInScope$ is empty or null', () => {
    instance.peerMapCompaniesCount$ = of(6);
    instance.exchangeJobIdsInScope$ = of(null);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
