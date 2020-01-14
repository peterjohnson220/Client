import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements AfterViewInit {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('projectAccessColumn', { static: false }) projectAccessColumn: ElementRef;
  @ViewChild('projectNameColumn', { static: false }) projectNameColumn: ElementRef;
  @ViewChild('projectOwnerColumn', { static: false }) projectOwnerColumn: ElementRef;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'UserSessions_Session_Name'
  }];

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'HasProjectAccess': { Template: this.projectAccessColumn },
      'Session_Name': { Template: this.projectNameColumn },
      'Create_User': { Template: this.projectOwnerColumn }
    };
  }

}
