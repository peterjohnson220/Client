import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromActions from '../actions';
import * as fromReducer from '../reducers';

import { JobManagementComponent } from './job-management.component';

describe('Job Management Feature - Job Management', () => {
  let instance: JobManagementComponent;
  let fixture: ComponentFixture<JobManagementComponent>;
  let store: Store<fromReducer.State>;
  let modal: NgbModal;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_job_management: combineReducers(fromReducer.reducers),
        })
      ],
      providers: [ ],
      declarations: [
        JobManagementComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);

    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(JobManagementComponent);
    instance = fixture.componentInstance;

  }));

  it('Should dispatch the LoadJobOptions action on init', () => {
    const expectedAction = new fromActions.LoadJobOptions();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should dispatch the ShowJobForm action when the showJobForm is set to true', () => {
    const expectedAction = new fromActions.ShowJobForm(true);

    instance.showJobForm = true;
    instance.ngOnChanges({
      showJobForm: new SimpleChange(null, true, true)
    });

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('Should reset the DuplicateJobCodeError and emit cancel changes on cancel', () => {
    spyOn(instance.cancelChanges, 'emit');

    const expectedAction = new fromActions.SetDuplicateJobCodeError(false);

    instance.onCancelChanges();
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    expect(instance.cancelChanges.emit).toHaveBeenCalledWith();
  });
});
