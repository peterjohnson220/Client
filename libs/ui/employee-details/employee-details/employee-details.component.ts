import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { PfThemeType } from '../../../features/pf-data-grid/enums/pf-theme-type.enum';
import { EmployeeDetails } from '../models/employee-details.model';

@Component({
  selector: 'pf-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {

  @Input() employeeDetails: EmployeeDetails;
  @Input() theme = PfThemeType.Default;
  @Input() optionalCloseButton: TemplateRef<any>;
  @Input() gridWidthPercent = 100;

  constructor() { }

  ngOnInit(): void {
  }
}
