import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromExchangeCompaniesActions from '../../actions/exchange-companies.actions';
import * as fromPeerAdminReducer from '../../reducers/index';
import { ExchangeCompaniesComponent } from './exchange-companies.component';

describe('Exchange Commpanies', () => {
  let fixture: ComponentFixture<ExchangeCompaniesComponent>;
  let instance: ExchangeCompaniesComponent;
  let store: Store<fromRootState.State>;
  let router: Router;

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
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ExchangeCompaniesComponent);
    instance = fixture.componentInstance;
  });

  it('should dispatch a LoadingExchangeCompanies action upon Init', () => {
    const action = new fromExchangeCompaniesActions.LoadingExchangeCompanies();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a LoadingExchangeCompanies action when handleExchangeGridReload is called', () => {
    const action = new fromExchangeCompaniesActions.LoadingExchanges();

    instance.handleExchangeCompaniesGridReload();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
