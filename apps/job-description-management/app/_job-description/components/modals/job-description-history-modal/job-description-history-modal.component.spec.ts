import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JobDescriptionHistoryModalComponent } from './job-description-history-modal.component';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: JobDescriptionHistoryModalComponent;
  let fixture: ComponentFixture<JobDescriptionHistoryModalComponent>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobDescriptionHistoryModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionHistoryModalComponent);
    instance = fixture.componentInstance;

    modal = TestBed.inject(NgbModal);
  });

  it('should dispatch LoadJobDescriptionHistoryListItems event and open modal, when calling open', () => {
    spyOn(modal, 'open');

    instance.jobDescriptionHistoryModal = {};

    const mockedJobDescriptionId = 1;
    const mockedJobTitle = 'Test Job Title';

    instance.open(mockedJobDescriptionId, mockedJobTitle);

    expect(instance.jobDescriptionId).toEqual(mockedJobDescriptionId);
    expect(instance.jobTitle).toEqual(mockedJobTitle);

    expect(modal.open).toHaveBeenLastCalledWith(instance.jobDescriptionHistoryModal, { backdrop: 'static', windowClass: 'job-description-history-modal' });
  });
});
