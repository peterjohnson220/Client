import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import { PfCommonModule } from 'libs/core/index';

import * as fromMarketDataFeedPageReducer from '../reducers';
import * as fromMarketDataFeedPageActions from '../actions/market-data-feed-page.actions';
import { MarketDataFeedPageComponent } from './market-data-feed.page';


describe('Pf-Admin - Market Data Feed Page', () => {
  let instance: MarketDataFeedPageComponent;
  let fixture: ComponentFixture<MarketDataFeedPageComponent>;
  let store: Store<fromMarketDataFeedPageReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          employees_main: combineReducers(fromMarketDataFeedPageReducer.reducers),
        }),
        PfCommonModule
      ],
      declarations: [ MarketDataFeedPageComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() }
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ]
    });

    fixture = TestBed.createComponent(MarketDataFeedPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should dispatch GenerateFeed action when handling generate export clicked', () => {
    const expectedAction = new fromMarketDataFeedPageActions.GenerateFeed();
    spyOn(store, 'dispatch');

    instance.generateExport();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
