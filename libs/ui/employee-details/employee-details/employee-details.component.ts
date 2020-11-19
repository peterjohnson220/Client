import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';

import * as moment from 'moment';

import { PfThemeType } from '../../../features/pf-data-grid/enums/pf-theme-type.enum';
import { EmployeeDetails } from '../models/employee-details.model';
import { rateEnum } from '../models/rate.enum';

@Component({
  selector: 'pf-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit, OnChanges {

  @Input() employeeDetails: EmployeeDetails;
  @Input() theme = PfThemeType.Default;
  @Input() optionalCloseButton: TemplateRef<any>;

  @ViewChild('toggleLink') toggleLink: ElementRef;
  isShowingMore = false;
  summaryText = '';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeDetails']) {
      let yearsOfService;
      this.summaryText = '';

      const employeeDetails = changes['employeeDetails'].currentValue;

      // moment calculation
      if (!this.isEmptyValue(employeeDetails.Date_Of_Hire)) {
        const currDate = moment(new Date());
        const momentHireDate = moment(employeeDetails.Date_Of_Hire);
        yearsOfService = Math.floor(currDate.diff(momentHireDate, 'years', true) * 2) / 2;
      }

      this.summaryText = this.isEmptyValue(employeeDetails.First_Name) && this.isEmptyValue(employeeDetails.Last_Name) ?
        employeeDetails.Employee_Id : employeeDetails.First_Name + ' ' + employeeDetails.Last_Name;

      this.summaryText = this.summaryText + ` is a ${
        this.isEmptyValue(employeeDetails.Full_Time_Employee) || employeeDetails.Full_Time_Employee === 1 ? 'full' : 'part'
      } time employee`;

      this.summaryText = this.isEmptyValue(employeeDetails.Date_Of_Hire) ?
        this.summaryText + `.` : this.summaryText + ` who has been with the company for ${yearsOfService} years. `;

      this.summaryText = this.summaryText +
        ` ${
        this.isEmptyValue(employeeDetails.First_Name) ? employeeDetails.Employee_Id : employeeDetails.First_Name
      } has a base ${
        employeeDetails.Rate === rateEnum.Hourly ? 'hourly ' : ''
      }salary of ${employeeDetails.Base_Salary} (${employeeDetails.Currency_Code})`;

      this.summaryText = this.isEmptyValue(employeeDetails.BaseMRP) ?
        this.summaryText +  `, this job has no Base MRP.` : this.summaryText +  `, which represents ${
        Math.round(employeeDetails.BaseMRP * 10) / 10
      }% of the base MRP.`;

    }
  }

  isEmptyValue(value: number | string): boolean {
    return value === null || value === '';
  }

  toggle() {
    this.toggleLink.nativeElement.blur();
    this.isShowingMore = !this.isShowingMore;
  }
}
