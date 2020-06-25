import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockExchange, StatusEnum } from 'libs/models';

import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeActions from '../../actions/exchange.actions';
import { ToggleExchangeStatusConfirmationModalComponent } from './toggle-exchange-status-confirmation-modal.component';


describe('Exchange Management - Toggle Exchange Status Confirmation Modal', () => {
  let fixture: ComponentFixture<ToggleExchangeStatusConfirmationModalComponent>;
  let instance: ToggleExchangeStatusConfirmationModalComponent;
  let store: Store<fromRootState.State>;

  const mockExchange = generateMockExchange();

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
        ToggleExchangeStatusConfirmationModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(ToggleExchangeStatusConfirmationModalComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it(`should display 'Deactivate' verbiage when exchange is active`, () => {
    instance.exchange$ = of({...mockExchange, Status: StatusEnum.Active});

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should display 'Activate' verbiage when exchange is inactive`, () => {
    instance.exchange$ = of({...mockExchange, Status: StatusEnum.Inactive});

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an UpdateExchangeStatus action when handleToggleConfirmed is triggered', () => {
    const exchange = {...mockExchange, Status: StatusEnum.Active};
    const expectedAction = new fromExchangeActions.UpdateExchangeStatus(exchange.ExchangeId, StatusEnum.Inactive);

    instance.exchange$ = of(exchange);

    fixture.detectChanges();

    instance.handleToggleConfirmed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it('should dispatch CloseToggleExchangeStatusModal action when handleModalDismissed is triggered', () => {
    instance.exchange$ = of(generateMockExchange());
    const expectedAction = new fromExchangeActions.CloseToggleExchangeStatusModal();

    instance.handleModalDismissed();

    fixture.detectChanges();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
