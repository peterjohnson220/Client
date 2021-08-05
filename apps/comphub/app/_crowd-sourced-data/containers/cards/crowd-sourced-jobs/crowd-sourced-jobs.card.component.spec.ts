import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import * as fromRootState from 'libs/state/state';

import { CrowdSourcedJobsCardComponent } from './crowd-sourced-jobs.card.component';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromJobGridActions from '../../../../_shared/actions/job-grid.actions';
import { generateMockWorkflowContext } from '../../../../_shared/models';

describe('Comphub - Crowd Sourced Data - Jobs Card Component', () => {
  let instance: CrowdSourcedJobsCardComponent;
  let fixture: ComponentFixture<CrowdSourcedJobsCardComponent>;
  let store: Store<fromComphubSharedReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          comphub_shared: combineReducers(fromComphubSharedReducer.reducers),
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
    fixture.detectChanges();
  });

  it('should dispatch an action to get the job search options with the search term, when there is a non empty search term', () => {
    spyOn(store, 'dispatch');

    const expectedAction = new fromJobGridActions.SearchCrowdSourcedJobsByTitle('Accountant');
    instance.handleJobSearchValueChanged('Accountant');

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedAction);
  });

  it('should NOT dispatch an action to get the job search options, when there is an empty search term', () => {
    spyOn(store, 'dispatch');

    instance.handleJobSearchValueChanged('');

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch a UpdateActiveCountryDataSet action with the country code when handling the country data set changes', () => {
    spyOn(store, 'dispatch');
    const expectedAction = new fromComphubPageActions.UpdateActiveCountryDataSet('CAN');

    instance.handleCountryDataSetChanged('CAN');

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});
