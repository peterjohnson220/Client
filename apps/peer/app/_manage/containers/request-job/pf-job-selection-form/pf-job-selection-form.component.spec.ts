import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum } from 'libs/models/index';

import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromPeerManagementReducer from '../../../reducers/index';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import { PayfactorsJobSelectionFormComponent } from './pf-job-selection-form.component';
import { generateMockExchangeJobRequestCandidate } from '../../../models';

describe('Peer - Manage - Request Job - Payfactors Job Selection Form', () => {
  let fixture: ComponentFixture<PayfactorsJobSelectionFormComponent>;
  let instance: PayfactorsJobSelectionFormComponent;

  let store: Store<fromPeerManagementReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        PayfactorsJobSelectionFormComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(PayfactorsJobSelectionFormComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockExchangeJobRequestCandidate()};
    instance.exchangeJobRequestForm = new FormGroup({});
  });

  it(`should apply the jobSelectionForm to the exchangeJobRequestForm on init`, () => {
    fixture.detectChanges();

    const childJobSelectionForm = instance.exchangeJobRequestForm.get('jobSelectionForm');
    expect(childJobSelectionForm).toBe(instance.payfactorsJobSelectionForm);
  });

  it('should dispatch a LoadCandidates action of type PayfactorsJob when handleReloadCardsEvent is triggered', () => {
    const expectedAction = new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.PayfactorsJob);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleReloadCardsEvent();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should dispatch an UpdateFilterOptions action of type PayfactorsJob when
      updateJDSearchFilter is triggered`, () => {
    const mockPayfactorsJob = generateMockExchangeJobRequestCandidate();
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

    fixture.detectChanges();

    spyOn(instance.reasonControl, 'reset');

    instance.exchangeRequestModalOpen$ = of(true);
    instance.handleCardSelectionEvent();

    expect(instance.reasonControl.reset).toHaveBeenCalled();
  });

  it(`should set the card selection when handleCardSelectionEvent is triggered`, () => {
    const expectedSelection = {...generateMockExchangeJobRequestCandidate(), MDJobsBaseId: 1};

    fixture.detectChanges();

    instance.cardSelector = {selectedCard: expectedSelection};

    spyOn(instance.jobSelection, 'setValue');

    instance.exchangeRequestModalOpen$ = of(true);
    instance.handleCardSelectionEvent();

    expect(instance.jobSelection.setValue).toHaveBeenCalledWith(expectedSelection);
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

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should clear search terms on init when the modal is not open`, () => {
    const expectedString = '';
    instance.jobTitleSearchTerm = 'MockSearchTerm';
    instance.jobDescriptionSearchTerm = 'MockJDSearchTerm';
    instance.jobDescriptionHighlightFilter = 'MockJDHighlightFilter';
    instance.exchangeRequestModalOpen$ = of(false);

    fixture.detectChanges();

    expect(instance.jobTitleSearchTerm).toBe(expectedString);
    expect(instance.jobDescriptionSearchTerm).toBe(expectedString);
    expect(instance.jobDescriptionHighlightFilter).toBe(expectedString);
  });
});
