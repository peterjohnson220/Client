import { Component, Input } from '@angular/core';

import { Workbook } from '../../../models';

@Component({
  selector: 'pf-dataview-workbook-card',
  templateUrl: './dataview-workbook-card.component.html',
  styleUrls: ['./dataview-workbook-card.component.scss']
})
export class DataViewWorkbookCardComponent {
  @Input() workbook: Workbook;
}
