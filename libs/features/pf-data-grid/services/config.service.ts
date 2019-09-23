import { Injectable, OnDestroy } from '@angular/core';

import { jobs } from '../data/jobs';
import { employees } from '../data/employees';
import { jobsConfig, employeesConfig } from '../data/grid-columns';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { PfDataGridConfig } from '../interfaces/pf-data-grid-config';

@Injectable()
export class ConfigService extends BehaviorSubject<PfDataGridConfig> implements OnDestroy {

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

  protected fetch(entity: string): Observable<PfDataGridConfig> {
    return of(this.dataSet[entity].config);
  }

  ngOnDestroy() {

  }
}
