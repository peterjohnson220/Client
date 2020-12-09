import { Component, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BulkExportSchedule, JobDescriptionViewListGridItem } from 'libs/models';

@Component({
  selector: 'pf-export-schedules-modal',
  templateUrl: './export-schedules-modal.component.html',
  styleUrls: ['./export-schedules-modal.component.scss']
})

export class ExportSchedulesModalComponent {
  @ViewChild('exportSchedulesModal', { static: true }) exportSchedulesModal: any;

  jobDescriptionViewName: string;
  modalRef: NgbModalRef;
  oneTimeExports: BulkExportSchedule[];
  scheduledExports: BulkExportSchedule[];

  constructor(private modalService: NgbModal) {}

  close() {
    this.modalService.dismissAll();
  }

  open(dataItem: JobDescriptionViewListGridItem) {
    this.jobDescriptionViewName = dataItem.ViewName;
    this.scheduledExports = dataItem.ExportSchedules.filter(s => s.Frequency !== 'One-time');
    this.oneTimeExports = dataItem.ExportSchedules.filter(s => s.Frequency === 'One-time');
    this.modalRef = this.modalService.open(this.exportSchedulesModal, { backdrop: true, size: 'lg' });
  }
}
