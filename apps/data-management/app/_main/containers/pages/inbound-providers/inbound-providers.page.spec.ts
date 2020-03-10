import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromProviderListPageActions from '../../../actions/provider-list.actions';
import * as fromProviderListReducers from '../../../reducers/provider-list.reducer';
import { generateMockProvider } from '../../../models';
import { InboundProvidersPageComponent } from './inbound-providers.page';

describe('Data Management - Main - Transfer Data Page - Inbound - Vendor', () => {
  let instance: InboundProvidersPageComponent;
  let fixture: ComponentFixture<InboundProvidersPageComponent>;
  let store: MockStore<any>;
  let router: Router;

  const initialState = {
    data_management: {
      providerList: fromProviderListReducers.initialState
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState}),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        }
      ],
      declarations: [InboundProvidersPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    store = TestBed.get(Store);
    router = TestBed.get(Router);
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
