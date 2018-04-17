import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum, generateMockCompanyOption, generateMockRequestExchangeRequest,
  generateMockAvailableExchangeItem } from 'libs/models';

import * as fromExchangeRequestActions from '../../../actions/exchange-request.actions';
import * as fromPeerMainReducer from '../../../reducers';
import { PayfactorsJobModalComponent } from './pf-job-modal.component';
import spyOn = jest.spyOn;
import { generateMockPayfactorsJob } from '../../../models';

describe('Peer - Exchange Request - Payfactors Job Modal', () => {
  let fixture: ComponentFixture<PayfactorsJobModalComponent>;
  let instance: PayfactorsJobModalComponent;

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
        PayfactorsJobModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(PayfactorsJobModalComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockPayfactorsJob()};
  });

  it('should dispatch a LoadCandidates action of type Access when handleReloadCardsEvent is triggered', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.PayfactorsJob);

    fixture.detectChanges();

    instance.handleReloadCardsEvent();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an UpdateFilterOptions action of type PayfactorsJob when
      updateJDSearchFilter is triggered`, () => {
    const mockPayfactorsJob = generateMockPayfactorsJob();
    const expectedFilterOptions = {JobDescriptionQuery: mockPayfactorsJob.JobDescription};
    const expectedAction = new fromExchangeRequestActions.UpdateFilterOptions(
      ExchangeRequestTypeEnum.PayfactorsJob,
      expectedFilterOptions
    );

    instance.payfactorsJobs$ = of([mockPayfactorsJob]);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.updateJDSearchFilter(mockPayfactorsJob.JobDescription);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should reset the reasonControl when handleCardSelectionEvent is triggered`, () => {
    instance.reason = 'mockReason';
    spyOn(instance.reasonControl, 'setValue');

    fixture.detectChanges();

    instance.handleCardSelectionEvent();

    expect(instance.reasonControl.setValue).toHaveBeenCalledWith('');
  });

  it(`should dispatch an UpdateSearchTerm action when updateJobTitleSearchFilter is triggered`, () => {
    const mockSearchTerm = 'Mock';
    const expectedAction = new fromExchangeRequestActions.UpdateSearchTerm(
      ExchangeRequestTypeEnum.PayfactorsJob,
      mockSearchTerm);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.updateJobTitleSearchFilter(mockSearchTerm);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CreateExchangeRequest action when handleFormSubmit is triggered`, () => {
    const mockRequestModel = {
      ...generateMockRequestExchangeRequest(ExchangeRequestTypeEnum.PayfactorsJob),
      ExchangeId: 0,
      TypeData: {
        MDJobsBaseId: 0
      }
    };
    const expectedAction = new fromExchangeRequestActions.CreateExchangeRequest(
      ExchangeRequestTypeEnum.PayfactorsJob,
      mockRequestModel
    );
    instance.exchangeRequestModalOpen$ = of(true);
    instance.reason = mockRequestModel.Reason;

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleFormSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch a CloseExchangeRequestModal action of type PayfactorsJob on modal dismissed`, () => {
    const expectedAction = new fromExchangeRequestActions.CloseExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob);
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleModalDismissed();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should clear form on init when the modal is not open`, () => {
    const expectedString = '';
    const expectedCardSelection = null;
    instance.reason = 'MockReason';
    instance.jobTitleSearchTerm = 'MockSearchTerm';
    instance.jobDescriptionSearchTerm = 'MockJDSearchTerm';
    instance.jobDescriptionHighlightFilter = 'MockJDHighlightFilter';
    instance.exchangeRequestModalOpen$ = of(false);

    fixture.detectChanges();

    expect(instance.reasonControl.value).toBe(expectedString);
    expect(instance.jobTitleSearchTerm).toBe(expectedString);
    expect(instance.jobDescriptionSearchTerm).toBe(expectedString);
    expect(instance.jobDescriptionHighlightFilter).toBe(expectedString);
    expect(instance.cardSelection).toBe(expectedCardSelection);
  });

});
