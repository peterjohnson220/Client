import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/index';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeChartTypeEnum } from 'libs/models/peer';

import { ChartDetailComponent } from './chart-detail.component';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';

describe('Peer Dashboard - Chart Detail', () => {
  let fixture: ComponentFixture<ChartDetailComponent>;
  let instance: ChartDetailComponent;
  let store: Store<fromPeerDashboardReducer.State>;
  let activatedRoute: ActivatedRoute;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
      ],
      declarations: [
        ChartDetailComponent
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

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ChartDetailComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should show the chart detail component', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it ('should dispatch the CloseSidebar action when clicking the close button', () => {
    const action = new fromExchangeDashboardActions.CloseSidebar();

    fixture.detectChanges();
    instance.closeSidebar();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it(`should NOT show card body header when detailChartType$ is Company`, () => {
    instance.detailChartType$ = of(ExchangeChartTypeEnum.Company);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should show a card header of 'Exchange Job Orgs' when the detailCharType$ is ExchangeJobOrgs`, () => {
    instance.detailChartType$ = of(ExchangeChartTypeEnum.ExchangeJobOrgs);

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
