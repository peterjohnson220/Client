import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange } from 'libs/models';

import { ExchangeDashboardPageComponent } from '../exchange-dashboard/exchange-dashboard.page';
import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromPeerMainReducer from '../../../reducers';

describe('Peer - Exchange Dashboard', () => {
  let fixture: ComponentFixture<ExchangeDashboardPageComponent>;
  let instance: ExchangeDashboardPageComponent;
  let router: Router;
  let store: Store<fromPeerMainReducer.State>;
  let activatedRoute: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
        }),
      ],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        },
      ],
      declarations: [
        ExchangeDashboardPageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    activatedRoute = TestBed.get(ActivatedRoute);

    fixture = TestBed.createComponent(ExchangeDashboardPageComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should show the dashboard with the exchange name and a container for the charts', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should navigate to the job mapping page when clicking the manage jobs button', () => {
    spyOn(router, 'navigate');

    instance.manageJobsClick();

    expect(router.navigate).toHaveBeenCalledWith(['exchange/job-mapping', activatedRoute.snapshot.params.id]);
  });

  it('should dispatch a industries loadingChart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: 'Industry'
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
