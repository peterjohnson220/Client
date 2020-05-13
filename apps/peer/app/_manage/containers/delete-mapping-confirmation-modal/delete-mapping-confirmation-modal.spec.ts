import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { Store, combineReducers, StoreModule } from '@ngrx/store';
import spyOn = jest.spyOn;

import * as fromRootState from 'libs/state/state';
import { generateMockExchangeJobMapping } from 'libs/models/peer';

import * as fromPeerManagementReducer from '../../reducers';
import * as fromExchangeJobMappingInfoActions from '../../actions/exchange-job-mapping-info.actions';
import { DeleteMappingConfirmationModalComponent } from './delete-mapping-confirmation-modal.component';


describe('Peer - Manage - Delete Confirmation Modal', () => {
  let fixture: ComponentFixture<DeleteMappingConfirmationModalComponent>;
  let instance: DeleteMappingConfirmationModalComponent;

  let store: Store<fromPeerManagementReducer.State>;

  const mockExchangeJobMapping = generateMockExchangeJobMapping();

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(fromPeerManagementReducer.reducers)
        }),
      ],
      declarations: [
        DeleteMappingConfirmationModalComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(DeleteMappingConfirmationModalComponent);
    instance = fixture.componentInstance;
    instance.selectedExchangeJobTitle = mockExchangeJobMapping.ExchangeJobTitle;

    spyOn(store, 'dispatch');

    // Trigger ngOnInit
    fixture.detectChanges();
  });

  it(`should match snapshot on init`, () => {
    expect(fixture).toMatchSnapshot();
  });

  it(`should dispatch DeleteMapping action when handleDeleteConfirmed is triggered`, () => {
    const mockPayload = {exchangeJobToCompanyJobId: mockExchangeJobMapping.CompanyJobMappings[0].ExchangeJobToCompanyJobId};
    const expectedAction = new fromExchangeJobMappingInfoActions.DeleteMapping(mockPayload);

    instance.exchangeJobToCompanyJobId = mockExchangeJobMapping.CompanyJobMappings[0].ExchangeJobToCompanyJobId;
    instance.handleDeleteConfirmed();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });

  it(`should dispatch CloseDeleteConfirmationModal action when handleDeleteDenied is triggered`, () => {
    const expectedAction = new fromExchangeJobMappingInfoActions.CloseDeleteConfirmationModal();

    instance.handleDeleteDenied();

    expect(store.dispatch).toBeCalledWith(expectedAction);
  });
});
