import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { ExchangeJobRequestsComponent } from './exchange-job-requests.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

describe('Exchange Job Requests', () => {
  let fixture: ComponentFixture<ExchangeJobRequestsComponent>;
  let instance: ExchangeJobRequestsComponent;
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
        ExchangeJobRequestsComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { parent: { params: { id : 1 } } } }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.parent.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeJobRequestsComponent);
    instance = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadExchangeJobRequests action ' +
    'when handleExchangeJobRequestsGridReload is called', () => {
    const action = new fromExchangeJobRequestsActions.LoadExchangeJobRequests(routeIdParam);

    instance.handleExchangeJobRequestsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
