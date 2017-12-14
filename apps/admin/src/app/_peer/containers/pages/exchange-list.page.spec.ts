import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import * as fromPeerAdminReducer from '../../reducers';
import { ExchangeListPageComponent } from './exchange-list.page';
import { generateMockUpsertExchangeRequest } from '../../../../../../../libs/models/peer';


describe('Exchange List Page', () => {
  let fixture: ComponentFixture<ExchangeListPageComponent>;
  let instance: ExchangeListPageComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeListPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

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

  it('should dispatch an OpenCreateExchangeModal action when openCreateExchangeModal is called', () => {
    const action = new fromExchangeListActions.OpenCreateExchangeModal();

    instance.openCreateExchangeModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an CloseCreateExchangeModal action when handleCreateExchangeModalDismissed is called', () => {
    const action = new fromExchangeListActions.CloseCreateExchangeModal();

    instance.handleCreateExchangeModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an UpsertingExchange action with payload when handleCreateExchange is called', () => {
    const newExchange = generateMockUpsertExchangeRequest();
    const action = new fromExchangeListActions.UpsertingExchange(newExchange);

    instance.handleCreateExchange(newExchange);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
