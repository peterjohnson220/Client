import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import { LngLatBounds } from 'mapbox-gl';

import * as fromRootState from 'libs/state/state';

import * as fromFeaturePeerMapReducer from '../../reducers';
import { ExchangeExplorerMapComponent } from './exchange-explorer-map.component';
import * as fromMapActions from '../../actions/map.actions';


jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  LngLatBounds: () => ({})
}));

describe('Features - Peer - Map Component', () => {
  let fixture: ComponentFixture<ExchangeExplorerMapComponent>;
  let instance: ExchangeExplorerMapComponent;
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
        ExchangeExplorerMapComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(ExchangeExplorerMapComponent);
    instance = fixture.componentInstance;
  });

  it('should load the exchange explorer map with default options', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the satellite style if it is enabled', () => {
    instance.satelliteStyleEnabled = true;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show the no data message on the map', () => {
    instance.peerMapShowNoData$ = of(true);
    instance.peerMapAutoZooming$ = of(false);
    instance.peerMapLoaded$ = of(true);
    instance.dataLoading$ = of(false);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should match satelliteStyleEnabledText when true', () => {
    instance.satelliteStyleEnabled = true;

    const result = instance.satelliteStyleEnabledText;

    expect(result).toEqual('Toggle Map View');
  });

  it('should match satelliteStyleEnabledText when false', () => {
    instance.satelliteStyleEnabled = false;

    const result = instance.satelliteStyleEnabledText;

    expect(result).toEqual('Toggle Satellite View');
  });

  it('should return a center of [0,0] when the map is not defined', () => {
    instance.map = null;

    const result = instance.center;

    expect(result).toEqual([0, 0]);
  });

  it('should dispatch a InitialZoomComplete action when handleZoomEnd is called and peerMapInitialZoomComplete$ is false', () => {
    instance.peerMapInitialZoomComplete$ = of(false);

    const expectedAction = new fromMapActions.InitialZoomComplete();

    spyOn(store, 'dispatch');

    instance.handleZoomEnd(null); // e event is not used in method.

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


  it('should dispatch a AutoZoomComplete action when handleZoomEnd is called and peerMapAutoZooming$ is true', () => {
    instance.peerMapAutoZooming$ = of(true);

    const expectedAction = new fromMapActions.AutoZoomComplete();

    spyOn(store, 'dispatch');

    instance.handleZoomEnd(null); // e event is not used in method.

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a MapLoaded action when handleLoadEvent is called', () => {
    const expectedAction = new fromMapActions.MapLoaded();

    spyOn(store, 'dispatch');

    instance.handleLoadEvent(null);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set ignoreNextMoveEnd to true when handleResizeEvent is called', () => {
    instance.handleResizeEvent();

    expect(instance.ignoreNextMoveEnd).toEqual(true);
  });

  it('should dispatch a MoveEnd action when handleMoveEndEvent is called and there are bounds and zoom', () => {
    instance.ignoreNextMoveEnd = false;
    instance.initialMoveEnd = true;
    instance.peerInitialMapBounds = [0, 1, 2, 3];
    instance.peerInitialMapZoomLevel = 1;

    const payload = {
      bounds: new LngLatBounds(
        [0, 1],
        [2, 3]
      ),
      zoom: 1
    };

    const expectedAction = new fromMapActions.MoveEnd(payload);

    spyOn(store, 'dispatch');

    instance.handleLoadEvent(null);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should set the selectedPoint when handleLayerHoverEvent is called', () => {
    instance.handleLayerHoverEvent({features: [1]});

    expect(instance.selectedPoint).toEqual(1);
  });

  it('should toggle the satelliteStyleEnabled value when toggleSatelliteStyle is called', () => {
    instance.satelliteStyleEnabled = true;
    instance.toggleSatelliteStyle();

    expect(instance.satelliteStyleEnabled).toBeFalsy();
  });
});
