import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';

import * as fromAddJobModalActions from '../../../actions/add-job-modal.actions';
import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import * as fromAddJobModalReducers from '../../../reducers';
import { AddJobModalComponent } from './add-job-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('Job Description Management - Job Description - Add Job Modal', () => {
  let instance: AddJobModalComponent;
  let fixture: ComponentFixture<AddJobModalComponent>;
  let store: Store<fromAddJobModalReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromAddJobModalReducers.reducers),
        })
      ],
      declarations: [
        AddJobModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn(), patchValue: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AddJobModalComponent);
    instance = fixture.componentInstance;

    instance.addJobForm = new FormGroup({});

    store = TestBed.get(Store);
    modal = TestBed.get(NgbModal);
  });

  it('should set addAndAssign to false, when calling handleTemplateChanged with value equal to -1', () => {
    instance.addAndAssign = true;

    instance.handleTemplateChanged(-1);

    expect(instance.addAndAssign).toEqual(false);
  });

  it('should set addAndAssign to true, when calling handleTemplateChanged with value greater than -1', () => {
    instance.addAndAssign = false;

    instance.handleTemplateChanged(1);

    expect(instance.addAndAssign).toEqual(true);
  });

  it('should reset variables, dispatch LoadTemplateList & SetDuplicateCompanyJobMessage and open modal, when calling open', () => {
    spyOn(instance.addJobForm, 'reset');
    spyOn(instance.addJobForm, 'patchValue');
    spyOn(store, 'dispatch');
    spyOn(modal, 'open');

    instance.companyId = 99;

    instance.open();

    const expectedFirstAction = new fromTemplateListActions.LoadTemplateList({ publishedOnly: true });

    expect(instance.addAndAssign).toEqual(false);
    expect(instance.addJobForm.patchValue).toHaveBeenLastCalledWith({ CompanyId: 99, JobStatus: true });
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expectedFirstAction);
    expect(modal.open).toHaveBeenLastCalledWith(instance.addJobModal, { backdrop: 'static', size: 'lg' });
  });

});
