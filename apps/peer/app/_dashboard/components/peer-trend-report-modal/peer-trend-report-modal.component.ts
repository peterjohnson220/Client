import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ReportViewTypes, Workbook } from 'libs/features/reports/models';

@Component({
  selector: 'pf-peer-trend-report-modal',
  templateUrl: './peer-trend-report-modal.component.html',
  styleUrls: ['./peer-trend-report-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeerTrendReportModalComponent {
  @ViewChild('peerTrendReportModal', { static: true }) public peerTrendReportModal: any;

  @Input() selectedWorkbook: Workbook;
  @Output() modalClosedEvent = new EventEmitter();

  peerTrendReportViewType = ReportViewTypes.PeerStandardWorkbook;

  constructor(
    private modalService: NgbModal
  ) { }

  open(): void {
    this.modalService.open(this.peerTrendReportModal, { backdrop: 'static', centered: true, size: 'xl', windowClass: 'modal-static-xxl' });
  }

  close(): void {
    this.modalClosedEvent.emit();
    this.modalService.dismissAll();
  }
}
