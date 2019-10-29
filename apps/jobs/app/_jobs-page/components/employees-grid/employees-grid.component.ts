import { Component, ViewChild, AfterViewInit, ElementRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';

import * as cloneDeep from 'lodash.clonedeep';

import { DataViewFilter } from 'libs/models/payfactors-api';
import { JobsHelpers } from '../../helpers/jobs.helpers';

@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit, OnChanges {

  @Input() filters: DataViewFilter[];

  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;

  jobDetailsFilters$: Observable<DataViewFilter[]>;

  refinedFilters: DataViewFilter[];
  colTemplates = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.refinedFilters = cloneDeep(changes['filters'].currentValue);
      JobsHelpers.updateJobIdFilter(this.refinedFilters, 'CompanyJob_ID', 'CompanyEmployees');
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Employee': this.employeeColumn
    };
  }

}
