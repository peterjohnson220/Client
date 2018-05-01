import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange, ExchangeChartTypeEnum, generateMockChartItem } from 'libs/models';

import { ExchangeJobFamilyChartComponent } from './exchange-job-family-chart.component';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';

describe('Peer Dashboard - Job Family Chart', () => {
  let fixture: ComponentFixture<ExchangeJobFamilyChartComponent>;
  let instance: ExchangeJobFamilyChartComponent;
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
        ExchangeJobFamilyChartComponent
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

    fixture = TestBed.createComponent(ExchangeJobFamilyChartComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should show the job family chart and title', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingJobFamilyChart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingJobFamilyChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Family
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });


  it('should dispatch a LoadingDetailChart for the job family on seriesClick', () => {
    fixture.detectChanges();

    const action = new fromExchangeDashboardActions.LoadingDetailChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Family,
      Category: 'Test'
    });

    instance.seriesClick({ category: action.payload.Category });

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should rotate the category label when there is more than 3 or more items in the chart', () => {
    instance.jobFamilyChartItems = [ generateMockChartItem(), generateMockChartItem(), generateMockChartItem() ];
    expect(instance.getCategoryLabelRotation()).toBe(-45);
  });

  it('should not rotate the category label when there is less than 3 items in the chart', () => {
    instance.jobFamilyChartItems = [ generateMockChartItem(), generateMockChartItem() ];
    expect(instance.getCategoryLabelRotation()).toBe(0);
  });

  it('should show 100% as the max when there is only one item', () => {
    instance.jobFamilyChartItems = [ generateMockChartItem() ];
    expect(instance.getValueAxisMax()).toBe(1);
  });

  it('should show 100% as the max when there is no items', () => {
    instance.jobFamilyChartItems = [  ];
    expect(instance.getValueAxisMax()).toBe(1);
  });

  it('should scale the percentage axis label when there is multiple items', () => {
    instance.jobFamilyChartItems = [ generateMockChartItem(), generateMockChartItem() ];
    expect(instance.getValueAxisMax()).toBe(null);
  });

});
