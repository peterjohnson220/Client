import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromPeerDataReducer from '../../reducers';
import { MapComponent } from './map.component';


describe('Legacy Content - Peer - Map Component', () => {
let fixture: ComponentFixture<MapComponent>;
let instance: MapComponent;
let store: Store<fromRootState.State>;
let route: ActivatedRouteStub;
const queryStringParams = {companyPayMarketId: 1, companyJobId: 2};

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerData: combineReducers(fromPeerDataReducer.reducers)
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: ActivatedRouteStub,
        }
      ],
      declarations: [
        MapComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    route.testParamMap = queryStringParams;

    fixture = TestBed.createComponent(MapComponent);
    instance = fixture.componentInstance;
  });

  // TODO: Add Tests
  it('does not have tests yet', () => {
    expect(true).toBe(true);
  });

});

export function getMockMapEvent(): any {
  return {
    target: {
      _loaded: true,
      getBounds() {
        return {
          _ne: {
            lat: 0, lng: 0
          },
          _sw: {
            lat: 0, lng: 0
          }
        };
      },
      getZoom() {
        return 1;
      }
    }
  };
}
