import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, generateMockCompanyOption, generateMockRequestExchangeRequest } from 'libs/models';

import * as fromPeerParticipantsActions from '../../../actions/peer-participants.actions';
import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { AccessModalComponent } from './access-modal.component';
import spyOn = jest.spyOn;
import { generateMockAvailableExchangeItem } from '../../../../../../../../libs/models/peer';

describe('Peer - Exchange Request - Access Modal', () => {
  let fixture: ComponentFixture<AccessModalComponent>;
  let instance: AccessModalComponent;

  let store: Store<fromPeerMainReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peerMain: combineReducers(fromPeerMainReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AccessModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(AccessModalComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockAvailableExchangeItem()};
  });

  it('should dispatch a LoadCandidates action of type Access when handleReloadCardsEvent is triggered', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.Access);

    fixture.detectChanges();

    instance.handleReloadCardsEvent();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an UpdateFilterOptions action of type Access when
      handleSelectedCompanyChangeEvent is triggered`, () => {
    const mockCompanyOption = generateMockCompanyOption();
    const expectedFilterOptions = {companyFilterId: mockCompanyOption.CompanyId};
    const expectedAction = new fromExchangeRequestActions.UpdateFilterOptions(
      ExchangeRequestTypeEnum.Access,
      expectedFilterOptions
    );

    instance.peerParticipants$ = of([mockCompanyOption]);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleSelectedCompanyChangeEvent(mockCompanyOption.Name);

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
      ExchangeRequestTypeEnum.Access,
      mockSearchTerm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.updateSearchFilter(mockSearchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CreateExchangeRequest action when handleFormSubmit is triggered`, () => {
    const mockRequestModel = {...generateMockRequestExchangeRequest(ExchangeRequestTypeEnum.Access), ExchangeId: 0};
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.Access,
      mockRequestModel
    );
    instance.reason = mockRequestModel.Reason;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CloseExchangeRequestModal action of type Access on modal dismissed`, () => {
    const expectedAction = new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.Access);
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a LoadPeerParticipants action when a peer is selected`, () => {
    const mockSearchTerm = 'Mock';
    const expectedAction = new fromPeerParticipantsActions.LoadPeerParticipants(mockSearchTerm);
    spyOn(store, 'dispatch');

    fixture.detectChanges();
    fixture.detectChanges();

    instance.list.writeValue(mockSearchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
