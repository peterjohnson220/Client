import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { generateMockJobDescriptionViewListGridItem } from 'libs/models';
import { TemplatesModalComponent } from './templates-modal.component';

describe('TemplatesModalComponent', () => {
  let component: TemplatesModalComponent;
  let fixture: ComponentFixture<TemplatesModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesModalComponent ],
      imports: [
        NgbModule
      ],
      providers: [
        {
          provide: NgbModal,
          useValue: {open: generateMockJobDescriptionViewListGridItem()},
        }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(TemplatesModalComponent);
    component = fixture.componentInstance;
    ngbModal = TestBed.inject(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the modal service to open the modal when open is called', () => {
    spyOn(ngbModal, 'open');
    component.open(generateMockJobDescriptionViewListGridItem());
    expect(ngbModal.open).toHaveBeenCalled();
  });
});
