import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange, generateMockChartItem, ExchangeChartTypeEnum } from 'libs/models';

import { ExchangeCompanyCountComponent } from './exchange-company-count.component';
import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerMainReducer from '../../reducers';

describe('Peer Dashboard - Exchange Job Count', () => {
  let fixture: ComponentFixture<ExchangeCompanyCountComponent>;
  let instance: ExchangeCompanyCountComponent;
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
      declarations: [
        ExchangeCompanyCountComponent
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

    fixture = TestBed.createComponent(ExchangeCompanyCountComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should display the company count', () => {
    instance.exchange$ = of(generateMockExchange());
    instance.chartItem = generateMockChartItem();

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a loading company chart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingCompanyChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Company
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a loading company detail chart action on init', () => {
    instance.exchange$ = of(generateMockExchange());
    const action = new fromExchangeDashboardActions.LoadingDetailChart({
      ExchangeId: activatedRoute.snapshot.params.id,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'All Companies'
    });

    instance.companyCountClick();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
