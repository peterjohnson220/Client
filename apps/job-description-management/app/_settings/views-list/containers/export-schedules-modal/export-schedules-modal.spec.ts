import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { generateMockJobDescriptionViewListGridItem } from 'libs/models';

import { ExportSchedulesModalComponent } from './export-schedules-modal.component';

describe('ExportSchedulesModalComponent', () => {
  let component: ExportSchedulesModalComponent;
  let fixture: ComponentFixture<ExportSchedulesModalComponent>;
  let ngbModal: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportSchedulesModalComponent ],
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

    fixture = TestBed.createComponent(ExportSchedulesModalComponent);
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

  it('should filter ExportSchedules into scheduledExports and oneTimeExports when open is called', () => {
    spyOn(ngbModal, 'open');
    component.open(generateMockJobDescriptionViewListGridItem());

    const isScheduledExportsOnly = component.scheduledExports.filter(s => s.Frequency === 'One-time').length === 0;
    const isOneTimeExportsOnly = component.oneTimeExports.filter(s => s.Frequency !== 'One-time').length === 0;

    expect(isScheduledExportsOnly).toBeTruthy();
    expect(isOneTimeExportsOnly).toBeTruthy();
  });
});
