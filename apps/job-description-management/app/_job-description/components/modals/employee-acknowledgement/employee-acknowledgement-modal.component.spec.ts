import { NO_ERRORS_SCHEMA } from '@angular/core';
import {ReactiveFormsModule, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EmployeeAcknowledgementModalComponent } from './employee-acknowledgement-modal.component';

describe('Job Description Management - Job Description - Employee Acknowledgement', () => {
  let instance: EmployeeAcknowledgementModalComponent;
  let fixture: ComponentFixture<EmployeeAcknowledgementModalComponent>;
  let modal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        EmployeeAcknowledgementModalComponent
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
    fixture = TestBed.createComponent(EmployeeAcknowledgementModalComponent);
    instance = fixture.componentInstance;

    instance.signatureForm = new FormGroup({});

    modal = TestBed.inject(NgbModal);
  });

  it('should open acknowledgement modal, when calling open', () => {
    jest.spyOn(modal, 'open').mockImplementation(jest.fn());
    jest.spyOn(instance.signatureForm, 'reset').mockImplementation(jest.fn());
    jest.spyOn(instance.signatureForm, 'setValue').mockImplementation(jest.fn());

    instance.employeeAcknowledgementModal = {};

    instance.open();

    expect(instance.attemptedAcknowledge).toEqual(false);
    expect(instance.signatureForm.reset).toHaveBeenCalled();

    expect(modal.open).toHaveBeenLastCalledWith(instance.employeeAcknowledgementModal, { backdrop: 'static'});
  });
});
