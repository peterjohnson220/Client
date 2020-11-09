import { Component, Input, OnInit } from '@angular/core';
import { EmployeeDetails } from '../../models/employee-details.model';

@Component({
  selector: 'pf-emplyee-info',
  templateUrl: './emplyee-info.component.html',
  styleUrls: ['./emplyee-info.component.scss']
})

export class EmplyeeInfoComponent implements OnInit {

  @Input() employeeInfo: EmployeeDetails;
  @Input() gridWidthPercent = 100;

  constructor() { }

  ngOnInit(): void {
  }
}
