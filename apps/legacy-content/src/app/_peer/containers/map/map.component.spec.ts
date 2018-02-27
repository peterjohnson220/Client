import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeMapResponse } from 'libs/models/peer';

import * as fromPeerDataReducer from '../../reducers';
import { MapComponent } from './map.component';
import * as fromPeerMapActions from '../../actions/peer-map.actions';
import spyOn = jest.spyOn;

@Injectable()
export class ActivatedRouteStub {
  // ActivatedRoute.paramMap is Observable
  private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  // Test parameters
  private _testParamMap: ParamMap;
  get testParamMap() { return this._testParamMap; }
  set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.subject.next(this._testParamMap);
  }

  // ActivatedRoute.snapshot.paramMap
  get snapshot() {
    return { queryParamMap: this.testParamMap};
  }
}

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

  it('should dispatch LoadingInitialPeerMapFilter action OnInit using the route query string parameters', () => {
    const expectedAction = new fromPeerMapActions.LoadingInitialPeerMapFilter({
      CompanyJobId: queryStringParams.companyJobId,
      CompanyPayMarketId: queryStringParams.companyPayMarketId
    });
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an UpdatePeerMapFilterBounds action when refreshMap is called if canLoadPeerMap$ is true', () => {
    const mockMapEvent = getMockMapEvent();
    const expectedAction = new fromPeerMapActions.UpdatePeerMapFilterBounds({
      bounds: mockMapEvent.target.getBounds(),
      zoom: mockMapEvent.target.getZoom()
    });

    store.dispatch(new fromPeerMapActions.LoadingPeerMapSuccess(generateMockExchangeMapResponse()));

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.refreshMap(mockMapEvent);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
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
