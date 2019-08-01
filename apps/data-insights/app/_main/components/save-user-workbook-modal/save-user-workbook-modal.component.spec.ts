import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SaveUserWorkbookModalComponent } from './save-user-workbook-modal.component';
import { Entity, generateMockEntity, SaveUserWorkbookModalData } from '../../models';

describe('Data Insights - Save User Workbook Modal Component', () => {
  let instance: SaveUserWorkbookModalComponent;
  let fixture: ComponentFixture<SaveUserWorkbookModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ SaveUserWorkbookModalComponent ],
      providers: [
        {
          provide: NgbModal,
          useValue: { open: jest.fn(), dismissAll: jest.fn() },
        },
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(SaveUserWorkbookModalComponent);
    instance = fixture.componentInstance;
    ngbModal = TestBed.get(NgbModal);

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

  it('should emit saveClicked with correct data when save button clicked', () => {
    spyOn(instance.saveClicked, 'emit');
    const selectedEntity = generateMockEntity();
    const workbookName = 'Test Report';
    const workbookSummary = 'This is a report summary';
    const modalData: SaveUserWorkbookModalData = {
      Entity: selectedEntity,
      Name: workbookName,
      Summary: workbookSummary
    };

    instance.saveUserWorkbookForm.patchValue({
      entity: selectedEntity,
      name: workbookName,
      summary: workbookSummary
    });
    instance.save();

    expect(instance.saveClicked.emit).toHaveBeenCalledWith(modalData);
  });
});
