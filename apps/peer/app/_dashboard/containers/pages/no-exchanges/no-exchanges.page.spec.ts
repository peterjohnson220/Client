import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum } from 'libs/models';

import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import { NoExchangesPageComponent } from './no-exchanges.page';

describe('Peer Dashboard - Exchange Selector', () => {
  let fixture: ComponentFixture<NoExchangesPageComponent>;
  let instance: NoExchangesPageComponent;
  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule.forRoot(),
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers),
        }),
      ],
      declarations: [
        NoExchangesPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(NoExchangesPageComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should dispatch OpenExchangeAccessModal action when openRequestAccessModal is called', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access);

    instance.openRequestAccessModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
