import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromFeaturePeerMapReducer from '../../reducers';
import { MapComponent } from './map.component';

jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Features - Peer - Map Component', () => {
  let fixture: ComponentFixture<MapComponent>;
  let instance: MapComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_peerMap: combineReducers(fromFeaturePeerMapReducer.reducers)
        })
      ],
      declarations: [
        MapComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(MapComponent);
    instance = fixture.componentInstance;
  });

  // TODO: Add Tests
  it('does not have tests yet', () => {
    expect(true).toBe(true);
  });

});
