import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
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

  @ViewChild('toggleLink') toggleLink: ElementRef;
  isShowingMore = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggle() {
    this.toggleLink.nativeElement.blur();
    this.isShowingMore = !this.isShowingMore;
  }
}
