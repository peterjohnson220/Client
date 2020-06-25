import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionReducers from '../../../reducers';
import { AssignJobsToTemplateModalComponent } from '../../index';
import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import { generateMockCompanyJobViewListItem } from '../../../models';

describe('Job Description Management - Job Description - Assign Jobs To Template Modal', () => {
  let instance: AssignJobsToTemplateModalComponent;
  let fixture: ComponentFixture<AssignJobsToTemplateModalComponent>;
  let store: Store<fromJobDescriptionReducers.State>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          jobdescriptonmanagement_jobdescription: combineReducers(fromJobDescriptionReducers.reducers),
        })
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        }
      ],
      declarations: [
        AssignJobsToTemplateModalComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AssignJobsToTemplateModalComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
    modal = TestBed.inject(NgbModal);
  });

  it('should dispatch LoadTemplateList action, open modal, emit current job and template id & close modal, when calling open & submit',
    () => {
    spyOn(store, 'dispatch');
    spyOn(modal, 'open').and.returnValue(getMockNgbModalRef());
    spyOn(instance.templateAssignedToJob, 'emit');

    const mockSelectedCompanyJob = generateMockCompanyJobViewListItem();

    instance.selectedCompanyJob = cloneDeep(mockSelectedCompanyJob);

    instance.open();

    const expectedOpenRequest = { publishedOnly: true };
    const expectedOpenAction = new fromTemplateListActions.LoadTemplateList(expectedOpenRequest);

    expect(store.dispatch).toHaveBeenLastCalledWith(expectedOpenAction);
    expect(instance.templateId).toEqual(-1);
    expect(modal.open).toHaveBeenLastCalledWith(instance.assignJobsToTemplateModal, { backdrop: 'static' });

    instance.submit();

    const expectedEmitObject = { selectedCompanyJob: mockSelectedCompanyJob, templateId: -1 };

    expect(instance.templateAssignedToJob.emit).toHaveBeenLastCalledWith(expectedEmitObject);
  });

  function getMockNgbModalRef() {
    return { close: jest.fn() };
  }
});
