import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DeleteUserFormulaModalComponent } from './delete-user-formula-modal.component';

describe('Data Insights - Delete User FOrmula Modal Component', () => {
  let instance: DeleteUserFormulaModalComponent;
  let fixture: ComponentFixture<DeleteUserFormulaModalComponent>;
  let ngbModal: NgbModal;

  beforeEach( () => {
    TestBed.configureTestingModule({
      declarations: [DeleteUserFormulaModalComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), dismissAll: jest.fn()},
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DeleteUserFormulaModalComponent);
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

  it('should emit deleteClicked when delete button clicked', () => {
    spyOn(instance.deleteClicked, 'emit');
    instance.delete();

    expect(instance.deleteClicked.emit).toHaveBeenCalled();
  });

});
