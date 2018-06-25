import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StoreModule, combineReducers } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import { JobResultComponent } from './job-result.component';
import * as fromAddDataReducer from '../../reducers';
import { mockSurveyJob, mockPayfactorsJob } from '../../../models';

describe('Project - Add Data - Job Result', () => {
  let component: JobResultComponent;
  let fixture: ComponentFixture<JobResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          project_addData: combineReducers(fromAddDataReducer.reducers)
        })
      ],
      declarations: [ JobResultComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobResultComponent);
    component = fixture.componentInstance;
  });

  it('should display Show Cuts button when current job is not Payfactors', () => {
    component.job = mockSurveyJob;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should hide Show Cuts button when the current job is Payfactors', () => {
    component.job = mockPayfactorsJob;

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should display Hide Cuts label when toggling the data cuts display', () => {
    component.showDataCuts = false;

    component.toggleDataCutsDisplay();

    expect(component.toggleDataCutsLabel).toEqual('Hide Cuts');
  });
});
