import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeChartTypeEnum, generateMockChartItem } from 'libs/models';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeJobFamilyChartComponent } from './exchange-job-family-chart.component';

describe('Peer Dashboard - Job Family Chart', () => {
  let fixture: ComponentFixture<ExchangeJobFamilyChartComponent>;
  let instance: ExchangeJobFamilyChartComponent;
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
        ExchangeJobFamilyChartComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    // TODO: Resolve type mismatch here and use .inject
    route = TestBed.get(ActivatedRoute);

    route.setParamMap({ id: 1 });

    fixture = TestBed.createComponent(ExchangeJobFamilyChartComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should show the job family chart and title', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadDetailChart for the job family on seriesClick', () => {
    const action = new fromExchangeDashboardActions.LoadDetailChart({
      ExchangeId: 1,
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
