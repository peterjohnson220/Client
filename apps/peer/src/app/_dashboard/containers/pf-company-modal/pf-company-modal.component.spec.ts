import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, generateMockRequestExchangeRequest,
         generateMockExchange } from 'libs/models/index';
import { HumanizeNumberPipe } from 'libs/core/pipes/index';

import { PayfactorsCompanyModalComponent } from './pf-company-modal.component';
import { generateMockExistingCompany } from '../../models';
import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeRequestActions from '../../../shared/actions/exchange-request.actions';
import * as fromSharedPeerReducer from '../../../shared/reducers';

describe('Peer - Exchange Request - Invite Pf Companies Modal', () => {
  let fixture: ComponentFixture<PayfactorsCompanyModalComponent>;
  let instance: PayfactorsCompanyModalComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          sharedPeer: combineReducers(fromSharedPeerReducer.reducers),
          peerDashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        PayfactorsCompanyModalComponent, HumanizeNumberPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(PayfactorsCompanyModalComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockExistingCompany()};
  });

  it('should dispatch a LoadCandidates action of type ReferPayfactorsCompany when handleReloadCardsEvent is triggered', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.ReferPayfactorsCompany);

    fixture.detectChanges();

    instance.handleReloadCardsEvent();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should reset the reasonControl when handleCardSelectionEvent is triggered`, () => {
    instance.reason = 'mockReason';
    spyOn(instance.reasonControl, 'setValue');

    fixture.detectChanges();

    instance.handleCardSelectionEvent();

    expect(instance.reasonControl.setValue).toHaveBeenCalledWith('');
  });

  it(`should dispatch an UpdateSearchTerm action when updateSearchFilter is triggered`, () => {
    const mockSearchTerm = 'Mock';
    const expectedAction = new fromExchangeRequestActions.UpdateSearchTerm(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      mockSearchTerm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.updateSearchFilter(mockSearchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CreateExchangeRequest action when handleFormSubmit is triggered`, () => {
    const mockExchange = generateMockExchange();
    const mockRequestModel = {
      ...generateMockRequestExchangeRequest(ExchangeRequestTypeEnum.ReferPayfactorsCompany),
      ExchangeId: mockExchange.ExchangeId,
      TypeData: {
        CompanyId: null
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany,
      mockRequestModel
    );

    instance.exchange$ = of(mockExchange);
    instance.reason = mockRequestModel.Reason;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CloseExchangeRequestModal action of type Access on modal dismissed`, () => {
    const expectedAction = new fromExchangeRequestActions.CloseExchangeRequestModal(
      ExchangeRequestTypeEnum.ReferPayfactorsCompany
    );
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
