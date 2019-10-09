import { Component, Input } from '@angular/core';
import { DataViewExportListItem } from '../../models';

@Component({
  selector: 'pf-data-views-export-card',
  templateUrl: './data-views-export-card.component.html',
  styleUrls: ['./data-views-export-card.component.scss']
})
export class DataViewsExportCardComponent {
@Input() fileName: string;

  constructor() { }
}
