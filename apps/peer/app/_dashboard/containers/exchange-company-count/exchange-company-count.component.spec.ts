import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import {  generateMockChartItem, ExchangeChartTypeEnum } from 'libs/models';
import { ActivatedRouteStub } from 'libs/test/activated-route-stub';

import * as fromExchangeDashboardActions from '../../actions/exchange-dashboard.actions';
import * as fromPeerDashboardReducer from '../../reducers';
import { ExchangeCompanyCountComponent } from './exchange-company-count.component';

describe('Peer Dashboard - Exchange Job Count', () => {
  let fixture: ComponentFixture<ExchangeCompanyCountComponent>;
  let instance: ExchangeCompanyCountComponent;
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
        ExchangeCompanyCountComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    route.setParamMap({ id: 1 });

    fixture = TestBed.createComponent(ExchangeCompanyCountComponent);
    instance = fixture.componentInstance;

    spyOn(store, 'dispatch');
  });

  it('should display the participating company count and total company count', () => {
    instance.participatingCompaniesChartItem = { ...generateMockChartItem(), Value: 10 };
    instance.allCompaniesChartItem = { ...generateMockChartItem(), Value: 10 };

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingDetailChart action of Category "Parcipitating Companies" on participatingCompaniesCountClick', () => {
    fixture.detectChanges();

    const action = new fromExchangeDashboardActions.LoadingDetailChart({
      ExchangeId: 1,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'Participating Companies'
    });

    instance.participatingCompaniesCountClick();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingDetailChart action of Category "All Companies" on allCompaniesCountClick', () => {
    fixture.detectChanges();

    const action = new fromExchangeDashboardActions.LoadingDetailChart({
      ExchangeId: 1,
      ChartType: ExchangeChartTypeEnum.Company,
      Category: 'All Companies'
    });

    instance.allCompaniesCountClick();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
