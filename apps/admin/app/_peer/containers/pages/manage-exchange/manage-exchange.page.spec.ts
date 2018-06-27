import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange } from 'libs/models/peer';

import * as fromPeerAdminReducer from '../../../reducers';
import { ManageExchangePageComponent } from './manage-exchange.page';
import { GridHelperService } from '../../../services';

describe('Manage Exchange Page', () => {
  let fixture: ComponentFixture<ManageExchangePageComponent>;
  let instance: ManageExchangePageComponent;
  let store: Store<fromRootState.State>;
  let gridHelperService: GridHelperService;
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
        ManageExchangePageComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id : 1 } } }
        },
        {
          provide: GridHelperService,
          useValue: { loadExchangeJobs: jest.fn(),
                      loadExchangeCompanies: jest.fn(),
                      loadPendingExchangeAccessRequests: jest.fn(),
                      loadPayfactorsCompanyExchangeInvitations: jest.fn(),
                      loadNewCompanyExchangeInvitations: jest.fn()}
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    gridHelperService = TestBed.get(GridHelperService);
    activatedRoute = TestBed.get(ActivatedRoute);
    routeIdParam = activatedRoute.snapshot.params.id;

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ManageExchangePageComponent);
    instance = fixture.componentInstance;
    instance.exchangeId = routeIdParam;
  });

  it('should pass the exchange name to the page title transclusion area', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a loadExchangeJobs, loadExchangeCompanies, loadPendingExchangeAccessRequests,' +
    'loadPayfactorsCompanyExchangeInvitations and loadNewCompanyExchangeInvitations action with exchange id on init', () => {
    instance.exchange$ = of(generateMockExchange());
    spyOn(gridHelperService, 'loadExchangeJobs');
    spyOn(gridHelperService, 'loadExchangeCompanies');
    spyOn(gridHelperService, 'loadPendingExchangeAccessRequests');
    spyOn(gridHelperService, 'loadPayfactorsCompanyExchangeInvitations');
    spyOn(gridHelperService, 'loadNewCompanyExchangeInvitations');

    fixture.detectChanges();

    expect(gridHelperService.loadExchangeJobs).toHaveBeenCalledWith(routeIdParam);
    expect(gridHelperService.loadExchangeCompanies).toHaveBeenCalledWith(routeIdParam);
    expect(gridHelperService.loadPendingExchangeAccessRequests).toHaveBeenCalledWith(routeIdParam);
    expect(gridHelperService.loadPayfactorsCompanyExchangeInvitations).toHaveBeenCalledWith(routeIdParam);
    expect(gridHelperService.loadNewCompanyExchangeInvitations).toHaveBeenCalledWith(routeIdParam);
  });
});
