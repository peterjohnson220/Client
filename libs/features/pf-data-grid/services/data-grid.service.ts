import { Injectable } from '@angular/core';

import { jobFields } from '../data/job-fields';
import { employeeFields } from '../data/employee-fields';
import { jobsConfig, employeesConfig } from '../data/grid-columns';
import { jobs } from '../data/jobs';
import { employees } from '../data/employees';


import { of, Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PfDataGridFieldModel } from 'libs/models';
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
}
