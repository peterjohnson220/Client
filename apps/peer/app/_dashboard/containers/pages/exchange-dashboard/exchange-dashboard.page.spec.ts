import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockExchange } from 'libs/models';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';

import { ExchangeDashboardPageComponent } from './exchange-dashboard.page';
import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromPeerSharedReducer from '../../../../shared/reducers';

describe('Peer - Exchange Dashboard', () => {
  let abstractFeatureFlagService: AbstractFeatureFlagService;
  let fixture: ComponentFixture<ExchangeDashboardPageComponent>;
  let instance: ExchangeDashboardPageComponent;
  let router: Router;
  let store: Store<fromPeerDashboardReducer.State>;
  let activatedRoute: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers),
          peer_shared: combineReducers(fromPeerSharedReducer.reducers)
        }),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 1 } }, parent: {parent: 'mock'} },
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        }
      ],
      declarations: [
        ExchangeDashboardPageComponent
      ],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ExchangeDashboardPageComponent);
    instance = fixture.componentInstance;
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);

    spyOn(store, 'dispatch');
  });

  it('should navigate to the job mapping page when clicking the manage jobs button', () => {

    fixture.detectChanges();

    spyOn(router, 'navigate');

    instance.manageJobsClick();

    expect(router.navigate).toHaveBeenCalledWith(['manage'], { relativeTo: activatedRoute.parent.parent });
  });

  it('should return expected strings after api result', () => {
    fixture.detectChanges();

    expect(instance.getTitle(false, true)).toBe('Failed to get map data');
    expect(instance.getTitle(false, false)).toBe('No exchange map data available');
    expect(instance.getTitle(true, false)).toBe('');
  });

  it('should dispatch a CloseSidebar action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.CloseSidebar();
    const exchange = generateMockExchange();
    const actionLoadMapCount = new fromExchangeDashboardActions.LoadMapCount(exchange.ExchangeId);

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
    expect(store.dispatch).toHaveBeenCalledWith(actionLoadMapCount);
  });
});
