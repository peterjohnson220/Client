import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import {  generateMockExchange } from 'libs/models/peer';

import * as fromImportExchangeJobActions from '../../../actions/import-exchange-jobs.actions';
import * as fromPeerAdminReducer from '../../../reducers';
import { ManageExchangePageComponent } from './manage-exchange.page';

describe('Exchange List Page', () => {
  let fixture: ComponentFixture<ManageExchangePageComponent>;
  let instance: ManageExchangePageComponent;
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
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [
        ManageExchangePageComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ManageExchangePageComponent);
    instance = fixture.componentInstance;
  });

  it('should pass the exchange name to the page title transclusion area', () => {
    instance.exchange$ = of(generateMockExchange());

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an OpeningImportExchangeJobsModal action when openCreateExchangeModal is called', () => {
    const action = new fromImportExchangeJobActions.OpeningImportExchangeJobsModal();

    instance.openImportExchangeJobsModal();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ClosingImportExchangeJobsModal action when handleImportExchangeJobsModalDismissed is called', () => {
    const action = new fromImportExchangeJobActions.ClosingImportExchangeJobsModal();

    instance.handleImportExchangeJobsModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch an ClosingImportExchangeJobsModal action when handleImportExchangeJobs is called', () => {
    const action = new fromImportExchangeJobActions.ClosingImportExchangeJobsModal();

    instance.handleImportExchangeJobs();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

});
