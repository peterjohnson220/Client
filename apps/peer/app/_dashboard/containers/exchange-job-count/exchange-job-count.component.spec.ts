import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockChartItem } from 'libs/models';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeJobCountComponent } from './exchange-job-count.component';

describe('Peer Dashboard - Exchange Job Count', () => {
  let fixture: ComponentFixture<ExchangeJobCountComponent>;
  let instance: ExchangeJobCountComponent;
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
        ExchangeJobCountComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);
    // TODO: Resolve type mismatch here and use .inject
    route = TestBed.get(ActivatedRoute);

    route.setParamMap({ id: 1 });

    fixture = TestBed.createComponent(ExchangeJobCountComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should display the job count', () => {
    instance.chartItem = { ...generateMockChartItem(), Value: 10 };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
