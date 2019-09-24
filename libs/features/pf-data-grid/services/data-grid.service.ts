import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import { of, Observable } from 'rxjs';

import { GridDataResult } from '@progress/kendo-angular-grid';

import { PfDataGridFieldModel, PfGridFieldFilter } from 'libs/models';
import { FilterOperatorOptions } from 'libs/ui/grid-filter/helpers/filter-operator-options/filter-operator-options';

import { jobFields } from '../data/job-fields';
import { employeeFields } from '../data/employee-fields';
import { jobsConfig, employeesConfig } from '../data/grid-columns';
import { jobs } from '../data/jobs';
import { employees } from '../data/employees';


@Injectable({
  providedIn: 'root'
})
export class DataGridService {

  dataSet = {
    'jobs': { fields: jobFields, config: jobsConfig, data: jobs },
    'employees': { fields: employeeFields, config: employeesConfig, data: employees }
  };

  constructor() { }

  getFields(entity: string): Observable<PfDataGridFieldModel[]> {
    return of(this.dataSet[entity].fields);
  }

  getData(entity: string): Observable<GridDataResult> {
    return of(<GridDataResult>{
      data: this.dataSet[entity].data,
      total: this.dataSet[entity].data.length
    });
  }

  getHumanizedFilter(columns: PfDataGridFieldModel[], filter: PfGridFieldFilter) {
    const field = columns.find(c => c.Field === filter.SourceName);
    if (field === null) {
      return `${filter.SourceName} ${filter.Operator} ${filter.Value}`;
    }

    const operatorDisplay = this.getOperatorDisplay(filter.Operator, field.Type);
    const valueDisplay = this.getValueDisplay(filter.Value, field.Type);
    return `${field.DisplayName} ${operatorDisplay} ${valueDisplay}`;
  }

  private getOperatorDisplay(operator: string, dataType: string) {
    let display = '';

    switch (dataType) {
      case 'text':
        display = FilterOperatorOptions.text.find(foo => foo.value === operator).display;
        break;
      case 'numeric':
        display = FilterOperatorOptions.numeric.find(foo => foo.value === operator).display;
        break;
      case 'date':
        display = FilterOperatorOptions.date.find(foo => foo.value === operator).display;
        break;
      default:
        break;
    }
    return display;
  }

  private getValueDisplay(value: string, dataType: string) {
    let display = value;

    switch (dataType) {
      case 'date':
        const dateFormatPipe = new DatePipe('en-US');
        display = dateFormatPipe.transform(display, 'MM/DD/YYYY');
        break;
    }
    return display;
  }
}
