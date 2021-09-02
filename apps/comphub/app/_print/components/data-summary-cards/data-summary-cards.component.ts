import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { DataSummaryReportData } from 'libs/models/comphub';

@Component({
  selector: 'pf-data-summary-cards',
  templateUrl: './data-summary-cards.component.html',
  styleUrls: ['./data-summary-cards.component.scss']
})
export class DataSummaryCardsComponent implements AfterViewInit {
  @Input() dataSummaryReport: DataSummaryReportData;

  @Output() dataSummaryRenderComplete = new EventEmitter();


  constructor() { }

  ngAfterViewInit() {
    if (this.dataSummaryReport) {
        this.dataSummaryRenderComplete.emit();
    }
  }
}
