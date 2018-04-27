import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange, ExchangeChartTypeEnum } from 'libs/models';

import { ExchangeIndustryChartComponent } from './exchange-industry-chart.component';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../../reducers';

describe('Peer Dashboard - Industry Chart', () => {
  let fixture: ComponentFixture<ExchangeIndustryChartComponent>;
  let instance: ExchangeIndustryChartComponent;
  let store: Store<fromPeerDashboardReducer.State>;
  let activatedRoute: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerDashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
      ],
      declarations: [
        ExchangeIndustryChartComponent
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
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);

    fixture = TestBed.createComponent(ExchangeIndustryChartComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should show the industry chart and title', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a industries LoadingIndustryChart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingIndustryChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Industry
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });


  it('should dispatch a LoadingDetailChart for the industry on seriesClick', () => {
    fixture.detectChanges();

    const action = new fromExchangeDashboardActions.LoadingDetailChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Industry,
      Category: 'Test'
    });

    instance.seriesClick({ category: action.payload.Category });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
