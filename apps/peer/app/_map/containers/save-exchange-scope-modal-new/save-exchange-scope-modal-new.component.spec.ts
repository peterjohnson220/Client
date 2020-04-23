import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';
import {
  generateMockUpsertExchangeScopeRequest, UpsertExchangeScopeRequest
} from 'libs/models/peer/requests/upsert-exchange-scope-request.model';
import { ExchangeScopeApiService } from 'libs/data/payfactors-api/peer';

import * as fromPeerMapReducer from '../../reducers';
import * as fromExchangeScopeActions from '../../actions/exchange-scope.actions';

import { SaveExchangeScopeModalNewComponent } from './save-exchange-scope-modal-new.component';

describe('Peer - Map - Save Exchange Scope Modal New', () => {
  const mockUpsertExchangeScopeRequest: UpsertExchangeScopeRequest = generateMockUpsertExchangeScopeRequest();
  let fixture: ComponentFixture<SaveExchangeScopeModalNewComponent>;
  let instance: SaveExchangeScopeModalNewComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_map: combineReducers(fromPeerMapReducer.reducers)
        }),
        ReactiveFormsModule
      ],
      declarations: [
        SaveExchangeScopeModalNewComponent
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

    store = TestBed.get(Store);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(SaveExchangeScopeModalNewComponent);
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

  it('should emit an upsertExchangeScopeEvent event with exchangeScopeName when handleFormSubmit is called', () => {
    instance.exchangeScopeNameControl.setValue(mockUpsertExchangeScopeRequest.ExchangeScopeName);
    instance.exchangeScopeDescriptionControl.setValue(mockUpsertExchangeScopeRequest.ExchangeScopeDescription);

    spyOn(instance.upsertExchangeScopeEvent, 'emit');

    instance.handleFormSubmit();

    expect(instance.upsertExchangeScopeEvent.emit).toHaveBeenCalledWith({
      Name: mockUpsertExchangeScopeRequest.ExchangeScopeName,
      Description: mockUpsertExchangeScopeRequest.ExchangeScopeDescription,
      IsDefault: !!mockUpsertExchangeScopeRequest.IsDefault
    });
  });
});
