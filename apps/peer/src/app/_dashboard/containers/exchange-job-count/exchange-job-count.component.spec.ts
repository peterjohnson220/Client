import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange, generateMockChartItem, ExchangeChartTypeEnum } from 'libs/models';

import { ExchangeJobCountComponent } from './exchange-job-count.component';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../../reducers';

describe('Peer Dashboard - Exchange Job Count', () => {
  let fixture: ComponentFixture<ExchangeJobCountComponent>;
  let instance: ExchangeJobCountComponent;
  let store: Store<fromPeerMainReducer.State>;
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
        ExchangeJobCountComponent
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

    fixture = TestBed.createComponent(ExchangeJobCountComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should display the job count', () => {
    instance.exchange$ = of(generateMockExchange());
    instance.chartItem = { ...generateMockChartItem(), Value: 10 };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a loading job chart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingJobChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Job
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
