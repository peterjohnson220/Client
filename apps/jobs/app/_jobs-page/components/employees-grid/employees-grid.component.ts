import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee'
  }];

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'Employee': { Template: this.employeeColumn }
    };
  }

}
