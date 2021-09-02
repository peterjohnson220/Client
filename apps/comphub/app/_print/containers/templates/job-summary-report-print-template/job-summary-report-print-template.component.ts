import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pf-job-summary-report-print-template',
  templateUrl: './job-summary-report-print-template.component.html',
  styleUrls: ['./job-summary-report-print-template.component.scss']
})
export class JobSummaryReportPrintTemplateComponent implements OnInit, AfterViewInit {
  @Input() pageNumber: number;

  @Output() renderComplete: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderComplete.emit(true);
  }
}
