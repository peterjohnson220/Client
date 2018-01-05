import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers/index';
import { ExchangeCompaniesComponent } from './exchange-companies.component';

describe('Exchange Commpanies', () => {
  let fixture: ComponentFixture<ExchangeCompaniesComponent>;
  let instance: ExchangeCompaniesComponent;
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
        ExchangeCompaniesComponent
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

    fixture = TestBed.createComponent(ExchangeCompaniesComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadingExchangeCompanies action with an exchange Id upon Init', () => {
    fixture.detectChanges();

    const action = new fromExchangeCompaniesActions.LoadingExchangeCompanies(routeIdParam);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingExchangeCompanies action when handleExchangeCompaniesGridReload is called', () => {
    const action = new fromExchangeCompaniesActions.LoadingExchangeCompanies(routeIdParam);

    instance.handleExchangeCompaniesGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a OpenAddExchangeCompaniesModal action when openAddExchangeCompaniesModal is called', () => {
    const action = new fromExchangeCompaniesActions.OpenAddExchangeCompaniesModal;

    instance.openAddExchangeCompaniesModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
