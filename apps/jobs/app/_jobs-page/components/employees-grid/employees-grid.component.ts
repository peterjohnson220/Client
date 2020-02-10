import {Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, ChangeDetectorRef} from '@angular/core';

import { Store } from '@ngrx/store';

import {Subscription} from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import {ViewField} from 'libs/models/payfactors-api/reports/request';
import * as cloneDeep from 'lodash.clonedeep';
import {DataViewApiService} from 'libs/data/payfactors-api/reports';
import * as fromJobsPageReducer from '../../reducers';




@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];
  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  globalFilterTemplates = {};
  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employee'
  }];
  pageViewId = '12147D19-592A-44AF-9696-7F5347873D5E';
  employeeGridFieldSubscription: Subscription;
  noResultsText = 'There are no employees in this Job.';
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;

  constructor(private store: Store<fromPfGridReducer.State>, private cd: ChangeDetectorRef) {
    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.employeeGridFieldSubscription = store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        const employeeSearchField = fields.find(f => f.SourceName === 'Employees');
        if (employeeSearchField.FilterValue) {
          this.noResultsText = 'No employees match your search. Please try again.';
        } else {
          this.noResultsText = 'There are no employees in this Job.';
        }
        this.cd.detectChanges();
      }
    });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          {Value : this.payMarketField.FilterValue, Id : this.payMarketField.FilterValue} : null;
      }
    });
  }

  ngAfterViewInit() {
    this.globalFilterTemplates = {
      'PayMarket' : { Template: this.payMarketFilter }
    };
    this.colTemplates = {
      'Employee': { Template: this.employeeColumn }
    };
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
    this.employeeGridFieldSubscription.unsubscribe();
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }
  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
