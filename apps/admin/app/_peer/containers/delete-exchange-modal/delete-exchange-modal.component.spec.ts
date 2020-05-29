import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeListItem } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeListActions from '../../actions/exchange-list.actions';
import { DeleteExchangeModalComponent } from './delete-exchange-modal.component';


describe('Delete Exchange Modal', () => {
  let fixture: ComponentFixture<DeleteExchangeModalComponent>;
  let instance: DeleteExchangeModalComponent;
  let store: Store<fromRootState.State>;

  const mockExchangeListItem = generateMockExchangeListItem();

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
        DeleteExchangeModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(DeleteExchangeModalComponent);
    instance = fixture.componentInstance;
    instance.selectedExchange = mockExchangeListItem;

    spyOn(store, 'dispatch');
  });

  it(`should match snapshot on init`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch DeleteExchange action when handleDeleteConfirmed is triggered', () => {
    const exchangeId = mockExchangeListItem.ExchangeId;
    const expectedAction = new fromExchangeListActions.DeleteExchange(exchangeId);

    instance.handleDeleteConfirmed();

    fixture.detectChanges();
    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseDeleteExchangeModal action when handleDeleteDenied is triggered', () => {
    const expectedAction = new fromExchangeListActions.CloseDeleteExchangeModal();

    instance.handleDeleteDenied();

    fixture.detectChanges();
    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
