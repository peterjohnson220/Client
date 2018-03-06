import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { ExchangeListItem, generateMockExchangeListItem } from 'libs/models/peer';
import * as fromRootState from 'libs/state/state';

import { ExchangeListPageComponent } from './exchange-list.page';
import * as fromPeerMainReducer from '../../../reducers';
import * as fromExchangeAccessActions from '../../../actions/exchange-access/exchange-access.actions';
import spyOn = jest.spyOn;

describe('Peer - Exchange List Page', () => {
  let fixture: ComponentFixture<ExchangeListPageComponent>;
  let instance: ExchangeListPageComponent;
  let store: Store<fromRootState.State>;
  let router: Router;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
        }),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        ExchangeListPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    router = TestBed.get(Router);
    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ExchangeListPageComponent);
    instance = fixture.componentInstance;
  });

  it('should tell the Router to navigate to the exchange passed to handleCellClick', () => {
    spyOn(router, 'navigate');

    const exchangeListItem: ExchangeListItem = generateMockExchangeListItem();

    instance.handleCellClick(exchangeListItem.ExchangeId);

    expect(router.navigate).toHaveBeenCalledWith(['exchange', exchangeListItem.ExchangeId]);
  });

  it('should dispatch OpenExchangeAccessModal action when openRequestAccessModal is called', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromExchangeAccessActions.OpenExchangeAccessModal;

    instance.openRequestAccessModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
