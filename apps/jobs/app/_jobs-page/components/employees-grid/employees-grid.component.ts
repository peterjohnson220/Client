import {Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';

import { Store } from '@ngrx/store';

import {Subscription} from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';



@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];
  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;

  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee'
  }];
  pageViewId = '12147D19-592A-44AF-9696-7F5347873D5E';
  employeeGridFieldSubscription: Subscription;
  noResultsText = 'There are no employees in this Job.';

  constructor(private store: Store<fromPfGridReducer.State>, private cd: ChangeDetectorRef) {
    this.employeeGridFieldSubscription = store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        const employeeSearchField = fields.find(f => f.SourceName === 'Employee');
        if (employeeSearchField.FilterValue) {
          this.noResultsText = 'No employees match your search. Please try again.';
        } else {
          this.noResultsText = 'There are no employees in this Job.';
        }
        this.cd.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Employee': { Template: this.employeeColumn }
    };
  }

  ngOnDestroy() {
    this.employeeGridFieldSubscription.unsubscribe();
  }
}
