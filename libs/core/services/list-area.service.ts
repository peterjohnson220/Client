import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ListAreaColumn } from 'libs/models/common';

import { DateOperatorOptions, NumericOperatorOptions, TextOperatorOptions } from '../../features/jobs/job-description-management/models/list-area-options.model';

@Injectable()
export class ListAreaService {

  constructor() { }
  getHumanizedFilter(listAreaColumns: ListAreaColumn[], filter: any) {
    const field = listAreaColumns.find(lac => lac.ColumnDatabaseName === filter.field);
    if (field == null) {
      return `${filter.field} ${filter.operator} ${filter.value}`;
    }
    const operatorDisplay = this.getOperatorDisplay(filter.operator, field.ColumnDataType);
    const valueDisplay = this.getValueDisplay(filter.value, field.ColumnDataType);

    return `${field.ColumnDisplayName} ${operatorDisplay} ${valueDisplay}`;
  }

  private getOperatorDisplay(op: string, dataType: string) {
    let display = '';
    switch (dataType) {
      case 'text':
        display = TextOperatorOptions.find(o => o.value === op).display;
        break;
      case 'numeric':
        display = NumericOperatorOptions.find(o => o.value === op).display;
        break;
      case 'date':
        display = DateOperatorOptions.find(o => o.value === op).display;
        break;
    }

    return display;
  }

  private getValueDisplay(value: any, dataType: string) {
    let display = value;

    switch (dataType) {
      case 'date':
        const dateFormatPipe = new DatePipe('en-US');
        display = dateFormatPipe.transform(display, 'MM/dd/yyyy');
        break;
      case 'boolean':
        const boolValue = JSON.parse(display);
        if (boolValue) {
          display = 'Enabled';
        } else {
          display = 'Disabled';
        }
        break;
    }

    return display;
  }
}
