import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  ExchangeChartTypeEnum } from 'libs/models';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeRevenueChartComponent } from './exchange-revenue-chart.component';

describe('Peer Dashboard - Revenue Chart', () => {
  let fixture: ComponentFixture<ExchangeRevenueChartComponent>;
  let instance: ExchangeRevenueChartComponent;
  let store: Store<fromPeerDashboardReducer.State>;
  let route: ActivatedRouteStub;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        }
      ],
      declarations: [
        ExchangeRevenueChartComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    // TODO: Resolve type mismatch here and use .inject
    route = TestBed.get(ActivatedRoute);

    route.setParamMap({ id: 1 });

    fixture = TestBed.createComponent(ExchangeRevenueChartComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should show the revenue chart and title', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadDetailChart for the revenue on seriesClick', () => {
    const action = new fromExchangeDashboardActions.LoadDetailChart({
      ExchangeId: 1,
      ChartType: ExchangeChartTypeEnum.Revenue,
      Category: 'Test'
    });

    instance.seriesClick({ category: action.payload.Category });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
