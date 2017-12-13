import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { ExchangeListItem, generateMockExchangeListItem } from 'libs/models/peer';

import * as fromExchangeListActions from '../../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../../reducers';
import { ExchangeListPageComponent } from './exchange-list.page';

describe('Exchange List Page', () => {
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
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
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

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeListPageComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadingExchanges action upon Init', () => {
    const action = new fromExchangeListActions.LoadingExchanges();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingExchanges action when handleExchangeGridReload is called', () => {
    const action = new fromExchangeListActions.LoadingExchanges();

    instance.handleExchangeGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should tell the Router to navigate to the exchange passed to handleCellClick', () => {
    spyOn(router, 'navigate');

    const exchangeListItem: ExchangeListItem = generateMockExchangeListItem();

    instance.handleCellClick({ dataItem: exchangeListItem });

    expect(router.navigate).toHaveBeenCalledWith(['/peer/exchange', 1]);
  });

});
