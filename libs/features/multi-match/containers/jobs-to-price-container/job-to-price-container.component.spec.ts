import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { DragulaModule } from 'ng2-dragula';

import { generateMockJobMatchCut } from 'libs/models/payfactors-api';
import * as fromRootState from 'libs/state/state';

import { JobsToPriceContainerComponent } from './jobs-to-price-container.component';
import { generateMockJobToPrice } from '../../models';
import * as fromMultiMatchReducer from '../../reducers';
import * as fromJobsToPriceActions from '../../actions/jobs-to-price.actions';

describe('Project - MultiMatch - JobToPrice Container Component', () => {
  let instance: JobsToPriceContainerComponent;
  let fixture: ComponentFixture<JobsToPriceContainerComponent>;
  let store: Store<fromMultiMatchReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_multiMatch: combineReducers(fromMultiMatchReducer.reducers)
        }),
        DragulaModule.forRoot()
      ],
      declarations: [ JobsToPriceContainerComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {

    store = TestBed.get(Store);
    fixture = TestBed.createComponent(JobsToPriceContainerComponent);
    instance = fixture.componentInstance;

  });

  it('should get job match cuts when load cuts clicked', () => {
    const job = generateMockJobToPrice();
    const expectedAction = new fromJobsToPriceActions.GetMatchJobCuts(job);
    spyOn(store, 'dispatch');

    instance.handleLoadDataCuts(job);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should not get job match cuts when load cuts clicked but job has no cuts', () => {
    const job = generateMockJobToPrice();
    job.TotalDataCuts = 0;
    const expectedAction = new fromJobsToPriceActions.GetMatchJobCuts(job);
    spyOn(store, 'dispatch');

    instance.handleLoadDataCuts(job);
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should not get job match cuts when load cuts clicked but job cuts already loaded', () => {
    const job = generateMockJobToPrice();
    job.JobMatchCuts = [generateMockJobMatchCut()];
    const expectedAction = new fromJobsToPriceActions.GetMatchJobCuts(job);
    spyOn(store, 'dispatch');

    instance.handleLoadDataCuts(job);
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch a delete cut action when job cut deleted', () => {
    const job = generateMockJobToPrice();
    job.JobMatchCuts = [generateMockJobMatchCut()];
    const expectedAction = new fromJobsToPriceActions.RemoveJobCut({JobId: job.Id, DataCut: job.JobMatchCuts[0]});
    spyOn(store, 'dispatch');

    instance.handleCutDeleted({jobCut: job.JobMatchCuts[0], job: job });
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

});
