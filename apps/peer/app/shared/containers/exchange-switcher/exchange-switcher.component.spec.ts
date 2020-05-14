import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeListItem, ExchangeRequestTypeEnum, generateMockExchange } from 'libs/models';
import * as fromUiPersistenceSettingsActions from 'libs/state/app-context/actions/ui-persistence-settings.actions';

import * as fromExchangeSelectorActions from '../../actions/exchange-selector.actions';
import * as fromPeerDashboardReducer from '../../../_dashboard/reducers';
import * as fromSharedPeerReducer from '../../reducers';
import * as fromSharedPeerExchangeActions from '../../actions/exchange.actions';
import * as fromExchangeRequestActions from '../../actions/exchange-request.actions';
import { ExchangeSwitcherComponent } from './exchange-switcher.component';

describe('Peer Dashboard - Exchange Selector', () => {
  let fixture: ComponentFixture<ExchangeSwitcherComponent>;
  let instance: ExchangeSwitcherComponent;
  let store: Store<fromPeerDashboardReducer.State>;
  let router: Router;
  let route: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbPopoverModule,
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers),
          peer_shared: combineReducers(fromSharedPeerReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeSwitcherComponent
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              snapshot: { url: [{ path: 'dashboard' }] }
            }
          }
        },
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    fixture = TestBed.createComponent(ExchangeSwitcherComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');

    // Need to fire of init for every test so that the ngOnDestroy can clean up properly
    fixture.detectChanges();
  });

  it('should dispatch OpenExchangeAccessModal action when openRequestAccessModal is called', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.Access);

    instance.openRequestAccessModal();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should close the popover when clicking on an exchange', () => {
    spyOn(instance.popover, 'close');

    instance.handleExchangeClicked(generateMockExchangeListItem());

    expect(instance.popover.close).toHaveBeenCalled();
  });

  it('should dispatch a SaveUiPersistenceSetting when clicking on an exchange', () => {
    const exchangeListItem = generateMockExchangeListItem();
    const expectAction = new fromUiPersistenceSettingsActions.SaveUiPersistenceSetting({
      FeatureArea: 'PeerDashboard',
      SettingName: 'SelectedExchangeId',
      SettingValue: exchangeListItem.ExchangeId.toString()
    });

    instance.handleExchangeClicked(generateMockExchangeListItem());

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should navigate to the exchangeId of the exchange that was clicked on', () => {
    spyOn(router, 'navigate');
    const exchangeListItem = generateMockExchangeListItem();

    instance.handleExchangeClicked(exchangeListItem);

    expect(router.navigate).toHaveBeenCalledWith(['/exchange', exchangeListItem.ExchangeId, route.parent.snapshot.url[0].path]);
  });

  it('should close the popover when opening the request access modal', () => {
    spyOn(instance.popover, 'close');

    instance.openRequestAccessModal();

    expect(instance.popover.close).toHaveBeenCalled();
  });

  it('should dispatch a LoadExchanges action if when upon init there is no exchanges', () => {
    const expectAction = new fromExchangeSelectorActions.LoadExchanges();
    store.dispatch(new fromExchangeSelectorActions.LoadExchangesSuccess([]));

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectAction);
  });

  it('should display the currently selected exchange name', () => {
      store.dispatch(new fromSharedPeerExchangeActions.LoadExchangeSuccess(
        { exchange: generateMockExchange(), path: '' }
      ));

      fixture.detectChanges();

      expect(fixture).toMatchSnapshot();
  });

  // TODO [BC]: Figure out how to have content within a template tag be rendered for snapshot testing.
  // it('should apply the current-exchange class to the exchange selection when it is the current exchange id', () => {
  //   store.dispatch(new fromSharedExchangeActions.LoadingExchangeSuccess(generateMockExchange());
  //   store.dispatch(new fromExchangeSelectorActions.LoadExchangesSuccess([generateMockExchangeListItem()]));
  //
  //   fixture.detectChanges();
  //
  //   expect(fixture).toMatchSnapshot();
  // });
});
