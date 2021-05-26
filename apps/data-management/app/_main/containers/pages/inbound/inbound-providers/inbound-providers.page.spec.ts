import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';


import { AbstractFeatureFlagService } from 'libs/core';
import * as fromRootState from 'libs/state/state';

import * as fromProviderListPageActions from '../../../../actions/provider-list.actions';
import * as fromProviderListReducers from '../../../../reducers/provider-list.reducer';
import { generateMockProvider } from '../../../../models';
import { InboundProvidersPageComponent } from './inbound-providers.page';
import { Store } from '@ngrx/store';

describe('Data Management - Main - Transfer Data Page - Inbound - Vendor', () => {
  let instance: InboundProvidersPageComponent;
  let fixture: ComponentFixture<InboundProvidersPageComponent>;
  let store: Store<fromProviderListReducers.State>;
  let router: Router;
  let abstractFeatureFlagService: AbstractFeatureFlagService;


  const initialState = {
    ...fromRootState.reducers,
    data_management: {
      providerList: fromProviderListReducers.initialState
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
      ],
      declarations: [InboundProvidersPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);
    fixture = TestBed.createComponent(InboundProvidersPageComponent);
    instance = fixture.componentInstance;
  }));

  it('should create', () => {
      fixture.detectChanges();
      expect(instance).toBeTruthy();
    });

  it('should dispatch init action when page is initialized', () => {
      spyOn(store, 'dispatch');

      instance.ngOnInit();
      fixture.detectChanges();

      const expectedInitAction = new fromProviderListPageActions.InitProviderList();
      expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedInitAction);
    });

  it('should dispatch an action when set transfer method button is clicked', () => {
      spyOn(store, 'dispatch');

      instance.ngOnInit();
      instance.setSelectedTransferMethod(1);
      fixture.detectChanges();

      const expectedResetWorkflowAction = new fromProviderListPageActions.SetSelectedTransferMethod(1);
      expect(store.dispatch).toHaveBeenCalledWith(expectedResetWorkflowAction);
    });

  it('should dispatch an action when set provider button is clicked', () => {
      spyOn(store, 'dispatch');

      instance.ngOnInit();
      const mock = generateMockProvider();
      instance.setSelectedProvider(mock);
      fixture.detectChanges();

      const expectedProviderSelectAction = new fromProviderListPageActions.SetSelectedProvider(mock);
      expect(store.dispatch).toHaveBeenCalledWith(expectedProviderSelectAction);
    });
});
