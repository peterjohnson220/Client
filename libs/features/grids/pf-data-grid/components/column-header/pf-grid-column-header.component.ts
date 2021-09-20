import { Component, Input } from '@angular/core';

import { ViewField } from 'libs/models/payfactors-api';

import { PfDataGridColType } from '../../enums';

@Component({
  selector: 'pf-grid-column-header',
  templateUrl: './pf-grid-column-header.component.html'
})
export class PfGridColumnHeaderComponent {
  @Input() columnHeaderTemplates: any;
  @Input() fieldName: string;
  @Input() field: ViewField;
  @Input() column: any;

  colType = PfDataGridColType;

  constructor() { }

  getColumnHeaderType(col: any): string {
    if (this.columnHeaderTemplates && this.columnHeaderTemplates[col.SourceName]) {
      return PfDataGridColType.template;
    } else if (this.columnHeaderTemplates && this.columnHeaderTemplates[col.HeaderTemplate]) {
      return PfDataGridColType.sharedTemplate;
    } else {
      return PfDataGridColType.default;
    }
  }
}
