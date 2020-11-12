import { Component, ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobDescriptionViewListGridItem, TemplateListItem } from 'libs/models';


@Component({
  selector: 'pf-templates-modal',
  templateUrl: './templates-modal.component.html',
  styleUrls: ['./templates-modal.component.scss']
})

export class TemplatesModalComponent {
  @ViewChild('templatesModal', { static: true }) exportSchedulesModal: any;

  jobDescriptionViewName: string;
  modalRef: NgbModalRef;
  templates: TemplateListItem[];

  constructor(private modalService: NgbModal) {}

  open(dataItem: JobDescriptionViewListGridItem) {
    this.jobDescriptionViewName = dataItem.ViewName;
    this.templates = dataItem.Templates;
    this.modalRef = this.modalService.open(this.exportSchedulesModal, { backdrop: true, size: 'lg' });
  }

  close() {
    this.modalService.dismissAll();
  }
}
