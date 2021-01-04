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
  displayDetails: EmployeeDetails;
  formattedSalary = '';
  formattedBaseMrp: number;
  yearsOfService: number;
  hourlyRate = rateEnum.Hourly;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employeeDetails']) {

      this.displayDetails = changes['employeeDetails'].currentValue;
      this.formattedSalary = Math.round(changes['employeeDetails'].currentValue.BaseSalary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

      if (this.displayDetails.DateOfHire !== null) {
        const currDate = moment(new Date());
        const momentHireDate = moment(this.displayDetails.DateOfHire);
        this.yearsOfService = Math.floor(currDate.diff(momentHireDate, 'years', true) * 2) / 2;
      }

      if (this.displayDetails.BaseMRP !== null) {
        this.formattedBaseMrp = Math.round(this.displayDetails.BaseMRP * 10) / 10;
      }
    }
  }

  toggle() {
    this.toggleLink.nativeElement.blur();
    this.isShowingMore = !this.isShowingMore;
  }
}
