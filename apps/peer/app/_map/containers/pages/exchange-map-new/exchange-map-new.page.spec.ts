import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromLibsRootState from 'libs/state/state';
import * as fromLibsPeerMapReducer from 'libs/features/peer/map/reducers';
import {
  generateMockUpsertExchangeScopeRequest,
  UpsertExchangeScopeRequest
} from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import { MapComponent } from 'libs/features/peer/map/containers/map';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';

import * as fromSharedPeerReducer from '../../../../shared/reducers';
import { ExchangeMapNewPageComponent } from './exchange-map-new.page';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Peer - Map - Exchange Map New Page', () => {
  const mockUpsertExchangeScopeRequest: UpsertExchangeScopeRequest = generateMockUpsertExchangeScopeRequest();
  let fixture: ComponentFixture<ExchangeMapNewPageComponent>;
  let instance: ExchangeMapNewPageComponent;
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
        },
        {
          provide: ExchangeExplorerContextService,
          useValue: {selectFilterContext: jest.fn(), selectCountOfCompanyFiltersSelected: jest.fn()}
        }
      ],
      declarations: [
        ExchangeMapNewPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeMapNewPageComponent);
    instance = fixture.componentInstance;
    instance.map = {getZoomLevel() { return mockUpsertExchangeScopeRequest.ZoomLevel; }} as MapComponent;
    instance.numberOfCompanySelections$ = of(0);
    instance.numberOfSelections$ = of(1);
    instance.peerMapCompaniesCount$ = of(5);
  });

  // TODO: Unit Tests

  it(`should have unit tests`, () => {
    expect(true).toBe(true);
  });
});
