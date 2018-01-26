import { Component, ViewChild } from '@angular/core';
import { TableauReportEmbedComponent } from '../../components/tableau-report-embed.component';

@Component({
  selector: 'pf-tableau-report-page',
  templateUrl: './tableau-report.page.html',
  styleUrls: ['./tableau-report.page.scss']
})
export class TableauReportPageComponent {
  @ViewChild(TableauReportEmbedComponent) reportEmbedComponent: TableauReportEmbedComponent

  constructor() {}


}
