import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pf-job-summary-report-print-template',
  templateUrl: './job-summary-report-print-template.component.html',
  styleUrls: ['./job-summary-report-print-template.component.scss']
})
export class JobSummaryReportPrintTemplateComponent implements AfterViewInit {
  @Input() pageNumber: number;
  @Output() renderComplete: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngAfterViewInit(): void {
    this.renderComplete.emit(true);
  }
}
