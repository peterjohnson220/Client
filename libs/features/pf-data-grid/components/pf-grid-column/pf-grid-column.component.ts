import { Component, Input } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';
import { PfDataGridColType } from '../../enums';

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

  colType = PfDataGridColType;

  constructor() { }

  getColumnType(col: any): string {
    if (this.columnTemplates && this.columnTemplates[col.SourceName]) {
      return PfDataGridColType.template;
    } else if (this.columnTemplates && this.columnTemplates[PfDataGridColType.currency] && col.Template === PfDataGridColType.currency) {
      return PfDataGridColType.currency;
    } else if (col.DataType === PfDataGridColType.dateTime) {
      return PfDataGridColType.dateTime;
    } else {
      return PfDataGridColType.default;
    }
  }
}
