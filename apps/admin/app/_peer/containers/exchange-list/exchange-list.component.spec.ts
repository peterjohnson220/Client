import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import { ExchangeListItem, generateMockExchangeListItem } from 'libs/models/peer/index';
import {HighlightTextPipe} from 'libs/core/pipes';
import * as fromRootState from 'libs/state/state';

import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../reducers';
import { ExchangeListComponent } from './exchange-list.component';


describe('Peer Features - Exchange List Component', () => {
  let fixture: ComponentFixture<ExchangeListComponent>;
  let instance: ExchangeListComponent;
  let store: Store<fromRootState.State>;

  const mockExchangeListItem = generateMockExchangeListItem();

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
      ],
      declarations: [
        ExchangeListComponent,
        HighlightTextPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeListComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadingExchanges action upon Init', () => {
    const action = new fromExchangeListActions.LoadExchanges('');

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingExchanges action when handleExchangeGridReload is called', () => {
    const action = new fromExchangeListActions.LoadExchanges('');

    instance.handleExchangeGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should emit an onCellClick event with the exchangeId when handleCellClick is triggered', () => {
    spyOn(instance.onCellClick, 'emit');

    const exchangeListItem: ExchangeListItem = mockExchangeListItem;

    instance.handleCellClick({ dataItem: exchangeListItem });

    expect(instance.onCellClick.emit).toHaveBeenCalledWith(exchangeListItem.ExchangeId);
  });

  it('should dispatch a OpenDeleteExchangeModal action when openDeleteExchangeModal is called', () => {
    const action = new fromExchangeListActions.OpenDeleteExchangeModal();
    const event = new MouseEvent('click');

    instance.openDeleteExchangeModal(event, mockExchangeListItem);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should set the selectedExchange when openDeleteExchangeModal is called', () => {
    const event = new MouseEvent('click');

    instance.openDeleteExchangeModal(event, mockExchangeListItem);

    expect(instance.selectedExchange).toBe(mockExchangeListItem);
  });
});
