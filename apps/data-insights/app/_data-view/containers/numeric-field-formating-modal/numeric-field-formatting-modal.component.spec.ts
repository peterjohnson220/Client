import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { generateMockField } from 'libs/features/formula-editor';

import { NumericFieldFormattingModalComponent } from './numeric-field-formatting-modal.component';

describe('Data Insights - Numeric Field Formatting Modal Component', () => {
  let instance: NumericFieldFormattingModalComponent;
  let fixture: ComponentFixture<NumericFieldFormattingModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [NumericFieldFormattingModalComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), dismissAll: jest.fn()},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(NumericFieldFormattingModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);

    fixture.detectChanges();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    const field = generateMockField();
    instance.open(field);

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should use the modal service to dismiss the modal, when close is called', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.close();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should emit saveClicked with correct data when save button clicked', () => {
    spyOn(instance.saveClicked, 'emit');
    const mockField = generateMockField();
    instance.field = mockField;

    instance.save();

    expect(instance.saveClicked.emit).toHaveBeenCalledWith(mockField);
  });
});

