import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditReportModalComponent } from './edit-report-modal.component';
import { generateMockStandardReportDetails, EditReportFormData } from '../../models';

describe('Data Insights Management - Edit Report Modal Component', () => {
  let instance: EditReportModalComponent;
  let fixture: ComponentFixture<EditReportModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ EditReportModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(EditReportModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);

    fixture.detectChanges();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    instance.open();

    expect(ngbModal.open).toHaveBeenCalled();
  });

  it('should use the modal service to dismiss the modal, when close is called', () => {
    spyOn(ngbModal, 'dismissAll');

    instance.close();

    expect(ngbModal.dismissAll).toHaveBeenCalled();
  });

  it('should update form with data from report when updateForm is called', () => {
    instance.report = generateMockStandardReportDetails();
    fixture.detectChanges();

    instance.updateForm();

    expect(instance.editReportForm.value.displayName).toEqual(instance.report.DisplayName);
    expect(instance.editReportForm.value.summary).toEqual(instance.report.Summary);
    expect(instance.thumbnailUrl).toEqual(instance.report.ThumbnailUrl);
  });

  it('should emit saveClicked when save is called', () => {
    spyOn(instance.saveClicked, 'emit');

    instance.report = generateMockStandardReportDetails();
    instance.updateForm();
    fixture.detectChanges();

    instance.save();

    const formData: EditReportFormData = {
      WorkbookId: instance.report.Id,
      DisplayName: instance.editReportForm.value.displayName,
      Summary: instance.editReportForm.value.summary,
      ThumbnailUrl: null
    };
    expect(instance.saveClicked.emit).toHaveBeenCalledWith(formData);
  });

  it('should send form data with updated name when report name changed', () => {
    spyOn(instance.saveClicked, 'emit');

    instance.report = generateMockStandardReportDetails();
    instance.updateForm();
    fixture.detectChanges();

    const updatedName = 'Custom report name';
    instance.editReportForm.patchValue({ displayName: updatedName });
    instance.save();

    const formData: EditReportFormData = {
      WorkbookId: instance.report.Id,
      DisplayName: updatedName,
      Summary: instance.editReportForm.value.summary,
      ThumbnailUrl: null
    };
    expect(instance.saveClicked.emit).toHaveBeenCalledWith(formData);
  });

  it('should send form data with updated thumbnail when thumbnail uploaded', () => {
    spyOn(instance.saveClicked, 'emit');

    instance.report = generateMockStandardReportDetails();
    instance.updateForm();
    fixture.detectChanges();

    const updatedName = 'Custom report name';
    instance.uploadedFileName = 'test.jpg';
    instance.editReportForm.patchValue({ displayName: updatedName });
    instance.save();

    const formData: EditReportFormData = {
      WorkbookId: instance.report.Id,
      DisplayName: updatedName,
      Summary: instance.editReportForm.value.summary,
      ThumbnailUrl: instance.uploadedFileName
    };
    expect(instance.saveClicked.emit).toHaveBeenCalledWith(formData);
  });

});
