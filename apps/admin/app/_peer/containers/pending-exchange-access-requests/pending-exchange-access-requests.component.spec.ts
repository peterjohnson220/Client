import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { PendingExchangeAccessRequestsComponent } from './pending-exchange-access-requests.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromPendingExchangeAccessRequestsActions from '../../actions/pending-exchange-access-requests.actions';

describe('Pending Exchange Access Requests', () => {
  let fixture: ComponentFixture<PendingExchangeAccessRequestsComponent>;
  let instance: PendingExchangeAccessRequestsComponent;
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
        PendingExchangeAccessRequestsComponent
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

    fixture = TestBed.createComponent(PendingExchangeAccessRequestsComponent);
    instance = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingPendingExchangeAccessRequests action when handlePendingExchangeAccessRequestsGridReload is called', () => {
    const action = new fromPendingExchangeAccessRequestsActions.LoadPendingExchangeAccessRequests(routeIdParam);

    instance.handlePendingExchangeAccessRequestsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
