import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { UpsertExchangeJobMapRequest } from 'libs/models/peer/requests/upsert-exchange-job-map.request.model';
import * as fromRootState from 'libs/state/state';
import { ExchangeJob, generateMockExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { CompanyJob, generateMockCompanyJob } from 'libs/features/peer/job-association/models/company-job.model';

import * as companyJobsActions from '../../actions/company-jobs.actions';
import * as manageReducers from '../../reducers/';
import { ConfirmCreateProjectModalComponent } from './confirm-create-project-modal.component';

describe('ConfirmUnmatchModalComponent', () => {
  let component: ConfirmCreateProjectModalComponent;
  let fixture: ComponentFixture<ConfirmCreateProjectModalComponent>;
  let store: Store<manageReducers.State>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          peer_manage: combineReducers(manageReducers.reducers)
        }),
      ],
      declarations: [ConfirmCreateProjectModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCreateProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render job details if the exchange and company jobs are falsy', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should render job details if the exchange job and company job are truthy', () => {
    component.selectedCompanyJob = generateMockCompanyJob();
    component.mappedExchangeJob = generateMockExchangeJob();

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch the expected action when the cancel method is invoked', () => {
    const expectedAction = new companyJobsActions.CancelCreateProject();
    component.handleCreateProjectCanceled();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch the expected action when the confirm unmatch method is invoked', () => {
    component.selectedCompanyJob = { ...generateMockCompanyJob(), CompanyJobId: 123 };
    component.mappedExchangeJob = { ... generateMockExchangeJob(), ExchangeId: 44, ExchangeJobId: 789 };

    const expectedAction = new companyJobsActions.CreateProject({JobIds: [123], PricingIds: [], JobPayMarketSelections: [] });

    component.handleCreateProjectConfirmed();
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
