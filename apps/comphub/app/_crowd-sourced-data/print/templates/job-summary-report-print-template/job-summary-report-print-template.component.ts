import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pf-job-summary-report-print-template',
  templateUrl: './job-summary-report-print-template.component.html',
  styleUrls: ['./job-summary-report-print-template.component.scss']
})
export class JobSummaryReportPrintTemplateComponent implements OnInit {
  @Input() pageNumber: number;

  constructor() { }

  ngOnInit(): void {
  }

}
