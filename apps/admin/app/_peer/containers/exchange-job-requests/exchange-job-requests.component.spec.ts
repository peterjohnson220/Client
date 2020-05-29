import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeJobRequest } from 'libs/models/peer';

import { ExchangeJobRequestsComponent } from './exchange-job-requests.component';
import * as fromPeerAdminReducer from '../../reducers';
import * as fromExchangeJobRequestsActions from '../../actions/exchange-job-requests.actions';

describe('Exchange Job Requests', () => {
  let fixture: ComponentFixture<ExchangeJobRequestsComponent>;
  let instance: ExchangeJobRequestsComponent;
  let store: Store<fromRootState.State>;
  let activatedRoute: ActivatedRoute;
  let routeIdParam: number;

  const mockRequest = generateMockExchangeJobRequest();

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

    store = TestBed.inject(Store);
    activatedRoute = TestBed.inject(ActivatedRoute);
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

  it('should dispatch an OpenJobRequestInfo action when a cell is clicked', () => {
    const event = { dataItem: mockRequest, rowIndex: 1};
    const action = new fromExchangeJobRequestsActions.OpenJobRequestInfo({
      selectedJobRequest: mockRequest,
      pageRowIndex: 1
    });

    instance.handleCellClick(event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseJobRequestInfo action when the job request info is closed', () => {
    const action = new fromExchangeJobRequestsActions.CloseJobRequestInfo();

    instance.handleCloseRequestInfo();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a ApproveExchangeJobRequest action ' +
    'when handleApproveJobRequest is called', () => {
    const action = new fromExchangeJobRequestsActions.ApproveExchangeJobRequest(mockRequest);

    instance.handleApproveJobRequest(mockRequest);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a DenyExchangeJobRequest action ' +
    'when handleDenyJobRequest is called', () => {
    const action = new fromExchangeJobRequestsActions.DenyExchangeJobRequest('reason');

    instance.handleDenyJobRequest('reason');

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseJobRequestDenyModal action ' +
    'when handleCloseDenyModal is called', () => {
    const action = new fromExchangeJobRequestsActions.CloseJobRequestDenyModal();

    instance.handleCloseDenyModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a CloseJobRequestApproveModal action ' +
    'when handleCloseApproveModal is called', () => {
    const action = new fromExchangeJobRequestsActions.CloseJobRequestApproveModal();

    instance.handleCloseApproveModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
