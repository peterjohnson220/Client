import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { UiPersistenceSettingsApiService } from 'libs/data/payfactors-api';
import { generateMockExchangeListItem } from 'libs/models/peer';

import { RedirectToExchangeComponent } from './redirect-to-exchange.component';
import * as fromPeerDashboardReducer from '../../reducers';
import { generateMockExchangesAndLastVisted } from '../../models';

describe('Peer Dashboard - Redirect to Exchange', () => {
  let fixture: ComponentFixture<RedirectToExchangeComponent>;
  let instance: RedirectToExchangeComponent;
  let store: Store<fromPeerDashboardReducer.State>;
  let router: Router;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers),
        }),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: UiPersistenceSettingsApiService,
          useValue: { getUiPersistenceSetting: jest.fn() },
        }
      ],
      declarations: [
        RedirectToExchangeComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(RedirectToExchangeComponent);
    instance = fixture.componentInstance;
  });

  it('should navigate to the no exchanges page when there are no exchanges', () => {
    spyOn(router, 'navigate');

    instance.navigateToExchange({...generateMockExchangesAndLastVisted(), Exchanges: []});

    expect(router.navigate).toHaveBeenCalledWith(['exchanges/no-exchanges']);
  });

  it('should navigate to the first exchange when there is no last visited exchange Id', () => {
    spyOn(router, 'navigate');

    instance.navigateToExchange({
      Exchanges: [{...generateMockExchangeListItem(), ExchangeId: 11}, {...generateMockExchangeListItem(), ExchangeId: 34}],
      LastVisitedExchangeId: null
    });

    expect(router.navigate).toHaveBeenCalledWith(['/exchange', 11, 'dashboard']);
  });

  it('should navigate to the first exchange when the last visited exchange Id is not an exchange in the list', () => {
    spyOn(router, 'navigate');

    instance.navigateToExchange({...generateMockExchangesAndLastVisted(), LastVisitedExchangeId: 43});

    expect(router.navigate).toHaveBeenCalledWith(['/exchange', 1, 'dashboard']);
  });
});
