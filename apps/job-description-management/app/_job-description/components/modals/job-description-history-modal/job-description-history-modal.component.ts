import { Component, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-job-description-history-modal',
  templateUrl: './job-description-history-modal.component.html',
  styleUrls: ['./job-description-history-modal.component.scss']
})

export class JobDescriptionHistoryModalComponent {
  jobDescriptionId: number;
  jobTitle: string;

  @ViewChild('jobDescriptionHistoryModal', { static: true }) public jobDescriptionHistoryModal: any;

  constructor(
    private modalService: NgbModal
  ) {}

  open(jobDescriptionId: number, jobTitle: string) {
    this.jobDescriptionId = jobDescriptionId;
    this.jobTitle = jobTitle;
    this.modalService.open(this.jobDescriptionHistoryModal, { backdrop: 'static', windowClass: 'job-description-history-modal' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

}
