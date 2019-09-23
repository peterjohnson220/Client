import { Injectable, OnDestroy } from '@angular/core';

import { jobs } from '../data/jobs';
import { employees } from '../data/employees';
import { jobsConfig, employeesConfig } from '../data/grid-columns';
import { Subject, Observable, of, BehaviorSubject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Injectable()
export class DataService extends BehaviorSubject<GridDataResult> implements OnDestroy {

  dataSet = {
    'jobs': { config: jobsConfig, data: jobs },
    'employees': { config: employeesConfig, data: employees }
  };

  constructor() {
    super(null);
  }

  public query(entity: string): void {
    this.fetch(entity).subscribe(x => super.next(x));
  }

  protected fetch(entity: string): Observable<GridDataResult> {
    return of(<GridDataResult>{
      data: this.dataSet[entity].data,
      total: this.dataSet[entity].data.length
    });
  }

  ngOnDestroy() {

  }
}
