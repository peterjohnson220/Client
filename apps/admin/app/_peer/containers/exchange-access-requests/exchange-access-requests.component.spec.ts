import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeAccessRequest } from 'libs/models/peer';

import { ExchangeAccessRequestsComponent } from './exchange-access-requests.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeAccessRequestsActions from '../../actions/exchange-access-requests.actions';

describe('Exchange Access Requests', () => {
  let fixture: ComponentFixture<ExchangeAccessRequestsComponent>;
  let instance: ExchangeAccessRequestsComponent;
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
        ExchangeAccessRequestsComponent
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

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.parent.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeAccessRequestsComponent);
    instance = fixture.componentInstance;
  });

  it('should match snapshot', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a LoadingExchangeAccessRequests action when handleExchangeAccessRequestsGridReload is called', () => {
    const action = new fromExchangeAccessRequestsActions.LoadExchangeAccessRequests(routeIdParam);

    instance.handleExchangeAccessRequestsGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should set collapse, selectedAccessRequest, and pageRowIndex correctly in the component when a cell is clicked', () => {
    instance.collapse = false;
    instance.pageRowIndex = null;
    instance.selectedAccessRequest = null;
    const event = { dataItem: generateMockExchangeAccessRequest(), rowIndex: 1};

    instance.handleCellClick(event);

    expect(instance.collapse).toBe(true);
    expect(instance.selectedAccessRequest).toEqual(generateMockExchangeAccessRequest());
    expect(instance.pageRowIndex).toBe(1);
  });

  it('should set collapse to false and pageRowIndex to null after the exchange access request info is closed', () => {
    instance.collapse = true;
    instance.pageRowIndex = 1;

    instance.handleCloseAccessRequestInfo();

    expect(instance.collapse).toBe(false);
    expect(instance.pageRowIndex).toBeNull();
  });
});
