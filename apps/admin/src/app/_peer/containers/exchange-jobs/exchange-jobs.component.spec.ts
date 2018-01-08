import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromExchangeJobsActions from '../../actions/exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../reducers/index';
import { ExchangeJobsComponent } from './exchange-jobs.component';

describe('Exchange Jobs', () => {
  let fixture: ComponentFixture<ExchangeJobsComponent>;
  let instance: ExchangeJobsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerAdmin: combineReducers(fromPeerAdminReducer.reducers)
        })
      ],
      declarations: [
        ExchangeJobsComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } },
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeJobsComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadingExchangeJobs action with the exchange id on init', () => {
    fixture.detectChanges();

    const action = new fromExchangeJobsActions.LoadingExchangeJobs(routeIdParam);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingExchangeJobs action when handleExchangeJobsGridReload is called', () => {
    const action = new fromExchangeJobsActions.LoadingExchangeJobs(routeIdParam);

    instance.handleExchangeJobsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
