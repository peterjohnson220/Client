import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { ExchangeRequestTypeEnum } from 'libs/models/index';
import {HumanizeNumberPipe} from 'libs/core/pipes';

import * as fromSharedPeerReducer from '../../../../shared/reducers/index';
import * as fromPeerDashboardReducer from '../../../reducers/index';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import { generateMockExistingCompany} from '../../../models';
import { ExistingCompanySelectionFormComponent } from './existing-company-selection-form.component';

describe('Peer - Dashboard - Invite Company - Existing Company Selection Form', () => {
  let fixture: ComponentFixture<ExistingCompanySelectionFormComponent>;
  let instance: ExistingCompanySelectionFormComponent;

  let store: Store<fromPeerDashboardReducer.State>;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_shared: combineReducers(fromSharedPeerReducer.reducers),
          peer_dashboard: combineReducers(fromPeerDashboardReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        ExistingCompanySelectionFormComponent, HumanizeNumberPipe
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(ExistingCompanySelectionFormComponent);
    instance = fixture.componentInstance;
    instance.cardSelector = {selectedCard: generateMockExistingCompany()};
    instance.requestCompanyForm = new FormGroup({});
  });

  it(`should apply the companySelectionForm to the requestCompanyForm on init`, () => {
    fixture.detectChanges();

    const childCompanySelectionForm = instance.requestCompanyForm.get('companySelectionForm');
    expect(childCompanySelectionForm).toBe(instance.companySelectionForm);
  });

  it('should dispatch a LoadCandidates action of type ReferPayfactorsCompany when handleReloadCardsEvent is triggered', () => {
    const expectedAction = new fromExchangeRequestActions.LoadCandidates(ExchangeRequestTypeEnum.ReferPayfactorsCompany);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    instance.handleReloadCardsEvent();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it(`should reset the reasonControl when handleCardSelectionEvent is triggered`, () => {
    instance.reason = 'mockReason';

    fixture.detectChanges();

    spyOn(instance.reasonControl, 'reset');

    instance.handleCardSelectionEvent();

    expect(instance.reasonControl.reset).toHaveBeenCalled();
  });

  it(`should set the card selection when handleCardSelectionEvent is triggered`, () => {
    const expectedSelection = {...generateMockExistingCompany(), CompanyId: 1};

    fixture.detectChanges();

    instance.cardSelector = {selectedCard: expectedSelection};

    spyOn(instance.companySelectionControl, 'setValue');

    instance.handleCardSelectionEvent();

    expect(instance.companySelectionControl.setValue).toHaveBeenCalledWith(expectedSelection);
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

  it(`should provide correct values to the pf-modal-form component`, () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it(`should clear search term on init when the modal is not open`, () => {
    const expectedString = '';
    instance.searchTerm = 'MockSearchTerm';
    instance.existingCompaniesExchangeRequestModalOpen$ = of(false);

    fixture.detectChanges();

    expect(instance.searchTerm).toBe(expectedString);
  });
});
