import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { ExchangeListItem, generateMockExchangeListItem } from '../../../models/peer';
import * as fromRootState from '../../../state/state';
import * as fromExchangeListActions from '../actions/exchange-list.actions';
import * as fromSharedPeerReducer from '../reducers';
import { ExchangeListComponent } from './exchange-list.component';

describe('Shared Exchange List Component', () => {
  let fixture: ComponentFixture<ExchangeListComponent>;
  let instance: ExchangeListComponent;
  let store: Store<fromRootState.State>;
  let router: Router;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          sharedPeer: combineReducers(fromSharedPeerReducer.reducers)
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        ExchangeListComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeListComponent);
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

  it('should emit an onCellClick event with the exchangeId when handleCellClick is triggered', () => {
    spyOn(instance.onCellClick, 'emit');

    const exchangeListItem: ExchangeListItem = generateMockExchangeListItem();

    instance.handleCellClick({ dataItem: exchangeListItem });

    expect(instance.onCellClick.emit).toHaveBeenCalledWith(exchangeListItem.ExchangeId);
  });

});
