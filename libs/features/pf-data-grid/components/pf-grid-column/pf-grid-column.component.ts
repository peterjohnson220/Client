import { Component, Input } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-grid-column',
  templateUrl: './pf-grid-column.component.html',
  styleUrls: ['./pf-grid-column.component.scss']
})
export class PfGridColumnComponent {

  @Input() columnTemplates: any;
  @Input() dataItem: any[];
  @Input() fieldName: string;
  @Input() field: ViewField;

  constructor() { }

  getColumnType(col: any): string {
    if (this.columnTemplates && this.columnTemplates[col.SourceName]) {
      return 'template';
    } else if (col.Template === 'currency') {
      return 'currency';
    } else if (col.DataType === 'dateTime') {
      return 'dateTime';
    } else {
      return 'default';
    }
  }


}
