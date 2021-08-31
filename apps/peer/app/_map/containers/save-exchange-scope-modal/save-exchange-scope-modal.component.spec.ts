import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import {
  generateMockUpsertExchangeExplorerScopeRequest, UpsertExchangeExplorerScopeRequest} from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import { ExchangeScopeApiService } from 'libs/data/payfactors-api/peer';

import * as fromPeerMapReducer from '../../reducers';
import * as fromExchangeScopeActions from '../../actions/save-exchange-scope.actions';

import { SaveExchangeScopeModalComponent } from './save-exchange-scope-modal.component';

describe('Peer - Map - Save Exchange Scope Modal', () => {
  const mockUpsertExchangeScopeRequest: UpsertExchangeExplorerScopeRequest = generateMockUpsertExchangeExplorerScopeRequest();
  let fixture: ComponentFixture<SaveExchangeScopeModalComponent>;
  let instance: SaveExchangeScopeModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_map: combineReducers(fromPeerMapReducer.reducers),
          feature_peer_exchangeExplorer: combineReducers(fromLibsPeerExchangeExplorerReducers.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        SaveExchangeScopeModalComponent
      ],
      providers: [
        {
          provide: ExchangeScopeApiService,
          useValue: { validateExchangeScopeName: jest.fn() }
        }
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(SaveExchangeScopeModalComponent);
    instance = fixture.componentInstance;
  });

  it('should show the form text and no error messages on init', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an CloseSaveExchangeScopeModal action when handleModalDismissed is called', () => {
    const action = new fromExchangeScopeActions.CloseSaveExchangeScopeModal();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should clear selectedParentPayMarketOptions when handleModalDismissed is called', () => {
    const action = new fromExchangeScopeActions.CloseSaveExchangeScopeModal();

    instance.handleModalDismissed();

    expect(instance.selectedParentPayMarketOptions).toStrictEqual([]);
  });

  it('should emit an upsertExchangeScopeEvent event with exchangeScopeName when handleFormSubmit is called', () => {
    instance.exchangeScopeNameControl.setValue(mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeName);
    instance.exchangeScopeDescriptionControl.setValue(mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeDescription);

    jest.spyOn(instance.upsertExchangeScopeEvent, 'emit');

    instance.handleFormSubmit();

    expect(instance.upsertExchangeScopeEvent.emit).toHaveBeenCalledWith({
      Name: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeName,
      Description: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.ExchangeScopeDescription,
      IsDefault: !!mockUpsertExchangeScopeRequest.ExchangeScopeDetails.IsDefault,
      CompanyPayMarketIdsToDefaultFor: mockUpsertExchangeScopeRequest.ExchangeScopeDetails.CompanyPayMarketIdsToDefaultFor
    });
  });
});
