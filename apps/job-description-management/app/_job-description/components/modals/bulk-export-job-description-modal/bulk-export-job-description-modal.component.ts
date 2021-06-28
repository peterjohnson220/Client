import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-bulk-export-job-description-modal',
  templateUrl: './bulk-export-job-description-modal.component.html',
  styleUrls: ['./bulk-export-job-description-modal.component.scss']
})
export class BulkExportJobDescriptionModalComponent {
  @Input() enableFileDownloadSecurityWarning: boolean;
  @Output() export = new EventEmitter();
  @ViewChild('bulkExportJobDescriptionModal', { static: true }) public bulkExportJobDescriptionModal: any;

  exportTypes = ['Word', 'Pdf'];
  exportType: string;

  constructor(private modalService: NgbModal) { }

  open(): void {
    this.exportType = 'Word';
    this.modalService.open(this.bulkExportJobDescriptionModal, { backdrop: 'static' });
  }

  close(): void {
    this.modalService.dismissAll();
  }

  exportClicked(): void {
    this.export.emit(this.exportType);
    this.close();
  }

  handleExportTypeChanged(exportType: string): void {
    this.exportType = exportType;
  }

}
