import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import { generateMockUserContext } from 'libs/models/security';

import { CrowdSourcedJobsCardComponent } from './crowd-sourced-jobs.card.component';
import * as fromComphubMainReducer from '../../../../_main/reducers';
import { generateMockWorkflowContext } from '../../../../_main/models';
import * as fromJobsCardActions from '../../../../_main/actions/jobs-card.actions';
import * as fromComphubPageActions from '../../../../_main/actions/comphub-page.actions';

describe('Comphub - Crowd Sourced Data - Jobs Card Component', () => {
  let instance: CrowdSourcedJobsCardComponent;
  let fixture: ComponentFixture<CrowdSourcedJobsCardComponent>;
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
      declarations: [ CrowdSourcedJobsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CrowdSourcedJobsCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);

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
    instance.handleJobSearchFilterChange('Accountant');

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch an action to get the job search options, when there is an empty search term', () => {
    spyOn(store, 'dispatch');

    instance.handleJobSearchFilterChange('');

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch a UpdateActiveCountryDataSet action with the country code when handling the country data set changes', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.UpdateActiveCountryDataSet('CAN');

    instance.handleCountryDataSetChanged('CAN');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
