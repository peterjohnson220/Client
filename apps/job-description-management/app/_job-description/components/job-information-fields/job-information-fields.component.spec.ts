import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../reducers';
import { JobInformationFieldsComponent } from './job-information-fields.component';
import { generateMockAvailableJobInformationField } from 'libs/features/jobs/job-description-management/models/available-job-information-field.model';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: JobInformationFieldsComponent;
  let fixture: ComponentFixture<JobInformationFieldsComponent>;
  let store: Store<fromJobDescriptionReducers.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      declarations: [
        JobInformationFieldsComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobInformationFieldsComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should check all fields, when calling toggleAllJobInformationFields & allJobInformationFieldsSelected is false',
    () => {
    spyOn(instance.selectedJobInformationIds, 'emit');
    spyOn(instance.selectedJobInformationFieldsString, 'emit');

    instance.allJobInformationFieldsSelected = false;
    instance.jobInformationFields = [generateMockAvailableJobInformationField(1), generateMockAvailableJobInformationField(2)];

    instance.toggleAllJobInformationFields();

    const checkedFields = instance.jobInformationFields.filter(jif => jif.Checked);
    const checkedFieldsAsString = JSON.stringify(checkedFields);

    expect(checkedFields.length).toEqual(2);
    expect(instance.selectedJobInformationFieldsAsString).toEqual(checkedFieldsAsString);
    expect(instance.selectedJobInformationIds.emit).toHaveBeenLastCalledWith([1, 2]);
    expect(instance.selectedJobInformationFieldsString.emit).toHaveBeenLastCalledWith(checkedFieldsAsString);
    expect(instance.jobInformationFieldSelected).toEqual(true);
    expect(instance.allJobInformationFieldsSelected).toEqual(true);
  });

  it('should uncheck all non-required fields, when calling toggleAllJobInformationFields & allJobInformationFieldsSelected is true',
    () => {
      spyOn(instance.selectedJobInformationIds, 'emit');
      spyOn(instance.selectedJobInformationFieldsString, 'emit');

      instance.allJobInformationFieldsSelected = true;

      const mockedJobInformationField1 = generateMockAvailableJobInformationField(1, true, true);
      const mockedJobInformationField2 = generateMockAvailableJobInformationField(2, false, true);

      instance.jobInformationFields = [mockedJobInformationField1, mockedJobInformationField2];

      instance.toggleAllJobInformationFields();

      const checkedFields = instance.jobInformationFields.filter(jif => jif.Checked);
      const checkedFieldsAsString = JSON.stringify(checkedFields);

      expect(checkedFields.length).toEqual(1);
      expect(instance.selectedJobInformationFieldsAsString).toEqual(checkedFieldsAsString);
      expect(instance.selectedJobInformationIds.emit).toHaveBeenLastCalledWith([1]);
      expect(instance.selectedJobInformationFieldsString.emit).toHaveBeenLastCalledWith(checkedFieldsAsString);
      expect(instance.jobInformationFieldSelected).toEqual(true);
      expect(instance.allJobInformationFieldsSelected).toEqual(false);
    });
});
