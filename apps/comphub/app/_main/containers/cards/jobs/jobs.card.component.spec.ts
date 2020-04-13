import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';
import { generateMockUserContext } from 'libs/models/security';

import { JobsCardComponent } from './jobs.card.component';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromJobsCardActions from '../../../actions/jobs-card.actions';
import * as fromCompHubPageActions from '../../../actions/comphub-page.actions';
import { generateMockWorkflowContext } from '../../../models';
import { of } from 'rxjs';

describe('Comphub - Main - Jobs Card Component', () => {
  let instance: JobsCardComponent;
  let fixture: ComponentFixture<JobsCardComponent>;
  let store: Store<fromComphubMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_main: combineReducers(fromComphubMainReducer.reducers),
        }),
        DropDownsModule,
      ],
      declarations: [ JobsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobsCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.get(Store);

    instance.workflowContext = generateMockWorkflowContext();
    instance.userContext$ = of(generateMockUserContext());
    fixture.detectChanges();
  });

  it('should dispatch an action to set the selected job, when valid search option selected', () => {
    spyOn(store, 'dispatch');
    instance.potentialOptions = ['Job A'];
    const expectedAction = new fromJobsCardActions.SetSelectedJob({ jobTitle: 'job a' });

    instance.handleJobSearchValueChanged('job a');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch a set selected job action when invalid search option selected', () => {
    spyOn(store, 'dispatch');
    instance.potentialOptions = ['Job B', 'Job C'];
    const expectedAction = new fromJobsCardActions.SetSelectedJob({ jobTitle: 'Job A'});

    instance.handleJobSearchValueChanged('Job A');

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to clear the selected job when invalid search option selected and there is a selected job', () => {
    spyOn(store, 'dispatch');
    instance.potentialOptions = ['Job B'];
    instance.selectedJob = 'Job B';
    const expectedAction = new fromJobsCardActions.ClearSelectedJob();

    instance.handleJobSearchValueChanged('Job');

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch an action to clear the selected job when invalid search option selected and there is not a selected job', () => {
    spyOn(store, 'dispatch');
    instance.potentialOptions = ['Job B'];
    instance.selectedJob = '';
    const expectedAction = new fromJobsCardActions.ClearSelectedJob();

    instance.handleJobSearchValueChanged('Job');

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch an action to get the job search options with the search term, when there is a non empty search term', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobsCardActions.GetJobSearchOptions('Accountant');
    instance.userContext = generateMockUserContext();
    instance.handleJobSearchFilterChange('Accountant');

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch an action to get the job search options, when there is an empty search term', () => {
    spyOn(store, 'dispatch');
    instance.userContext = generateMockUserContext();

    instance.handleJobSearchFilterChange('');

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch a SetSelectedJob action with the job title and navigateToNextCard set to true, ' +
    'when handling a trending job being clicked', () => {

    spyOn(store, 'dispatch');
    const expectedAction = new fromJobsCardActions.SetSelectedJob({ jobTitle: 'Accountant', navigateToNextCard: true});

    instance.handleTrendingJobClicked('Accountant');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a UpdateActiveCountryDataSet action with the country code when handling the country data set changes', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromCompHubPageActions.UpdateActiveCountryDataSet('CAN');

    instance.handleCountryDataSetChanged('CAN');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
