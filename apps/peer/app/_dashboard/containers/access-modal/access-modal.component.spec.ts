import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, generateMockCompanyOption, generateMockRequestExchangeRequest,
         generateMockAvailableExchangeItem } from 'libs/models';
import { HumanizeNumberPipe } from 'libs/core/pipes';

import { AccessModalComponent } from './access-modal.component';
import * as fromPeerDashboardReducer from '../../reducers';
import * as fromExchangeRequestActions from '../../../shared/actions/exchange-request.actions';

describe('Peer - Exchange Request - Access Modal', () => {
  let fixture: ComponentFixture<AccessModalComponent>;
  let instance: AccessModalComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        AccessModalComponent,
        HumanizeNumberPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(AccessModalComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockAvailableExchangeItem()};
    instance.list = {
      filterChange: new Subject(),
      reset: jest.fn(),
      writeValue: function(val: string) { this.value = val; },
      value: ''
    } as any;
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

  // Couldn't get this to work [JP]
  // it(`should dispatch a LoadPeerParticipants action when a peer is selected`, () => {
  //   const mockSearchTerm = 'Mock';
  //   const expectedAction = new fromPeerParticipantsActions.LoadPeerParticipants(mockSearchTerm);
  //   spyOn(store, 'dispatch');
  //
  //   fixture.detectChanges();
  //
  //   instance.list.writeValue(mockSearchTerm);
  //
  //   fixture.detectChanges();
  //
  //   expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  // });

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
