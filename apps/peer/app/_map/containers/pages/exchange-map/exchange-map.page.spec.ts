import {  NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute} from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import * as fromPeerMapActions from 'libs/features/peer/map/actions/map.actions';
import * as fromPeerMapReducer from 'libs/features/peer/map/reducers';
import { generateMockExchange } from 'libs/models/peer';

import * as fromSharedPeerExchangeActions from '../../../../shared/actions/exchange.actions';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import { ExchangeMapPageComponent } from './exchange-map.page';

describe('Peer - Exchange Map Page', () => {
  let fixture: ComponentFixture<ExchangeMapPageComponent>;
  let instance: ExchangeMapPageComponent;
  let store: Store<fromRootState.State>;
  let route: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          feature_peerMap: combineReducers(fromPeerMapReducer.reducers)
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

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeMapPageComponent);
    instance = fixture.componentInstance;
  });

  it('should show the exchange name as the page title', () => {
    store.dispatch(new fromSharedPeerExchangeActions.LoadExchangeSuccess(generateMockExchange()));

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LimitToExchange action upon Init with the routes exchange Id', () => {
    const expectedAction = new fromFilterSidebarActions.LimitToExchange(route.snapshot.params.id);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a LoadPeerMapData action upon Init', () => {
    const expectedAction = new fromPeerMapActions.LoadPeerMapData();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });


  it('should dispatch a ResetState action to the filterSidebar upon destroy', () => {
    const expectedAction = new fromFilterSidebarActions.ResetState();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a ResetState action to the map upon destroy', () => {
    const expectedAction = new fromPeerMapActions.ResetState();

    instance.ngOnDestroy();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
