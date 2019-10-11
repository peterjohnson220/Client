import { Component, Input } from '@angular/core';
import { DataViewExport } from '../../models';

@Component({
  selector: 'pf-data-views-export-card',
  templateUrl: './data-views-export-card.component.html',
  styleUrls: ['./data-views-export-card.component.scss']
})
export class DataViewsExportCardComponent {
  @Input() dataViewExport: DataViewExport;

  constructor() { }
}
