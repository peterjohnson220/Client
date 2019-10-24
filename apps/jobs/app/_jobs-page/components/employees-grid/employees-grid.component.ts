import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit {

  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;
  colTemplates = {};

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'Employee': this.employeeColumn
    };
  }

}
