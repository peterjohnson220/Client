import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShareJobDescriptionModalComponent } from './share-job-description-modal.component';

describe('Job Description Management - Job Description - Job Description Grid', () => {
  let instance: ShareJobDescriptionModalComponent;
  let fixture: ComponentFixture<ShareJobDescriptionModalComponent>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        ShareJobDescriptionModalComponent
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn() }
        },
        {
          provide: FormBuilder,
          useValue: { group: jest.fn(), reset: jest.fn() }
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ShareJobDescriptionModalComponent);
    instance = fixture.componentInstance;

    instance.addNonPfUserForm = new FormGroup({});

    modal = TestBed.inject(NgbModal);
  });

  it('should reset component variables and open the modal, when calling open', () => {
    spyOn(instance.addNonPfUserForm, 'reset');
    spyOn(modal, 'open');

    instance.shareJobDescriptionModal = {};

    instance.open();

    expect(instance.addNonPfUserForm.reset).toHaveBeenCalled();
    expect(modal.open).toHaveBeenCalled();
  });
});
