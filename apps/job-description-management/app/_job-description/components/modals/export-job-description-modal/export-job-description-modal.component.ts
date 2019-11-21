import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-export-job-description-modal',
  templateUrl: './export-job-description-modal.component.html',
  styleUrls: ['./export-job-description-modal.component.scss']
})
export class ExportJobDescriptionModalComponent {
  @Input() jobDescriptionViews: string[];
  @Output() export = new EventEmitter();
  @ViewChild('exportJobDescriptionModal', { static: true }) public exportJobDescriptionModal: any;

  selectedView: string;
  exportType: string;

  constructor(
    private modalService: NgbModal
  ) { }

  open(exportType: string): void {
    this.exportType = exportType;
    this.modalService.open(this.exportJobDescriptionModal, { backdrop: 'static' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  exportClicked(): void {
    this.export.emit({selectedView: this.selectedView, exportType: this.exportType});
    this.close();
  }

  handleViewChanged(view: string): void {
    this.selectedView = view;
  }
}
