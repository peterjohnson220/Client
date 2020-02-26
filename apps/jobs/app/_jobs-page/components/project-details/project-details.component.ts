import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as cloneDeep from 'lodash.clonedeep';
import { Subscription } from 'rxjs';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { Store } from '@ngrx/store';
import * as fromJobsPageReducer from '../../reducers';
import { PageViewIds } from '../../constants';



@Component({
  selector: 'pf-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements AfterViewInit, OnDestroy {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('projectAccessColumn', { static: false }) projectAccessColumn: ElementRef;
  @ViewChild('projectNameColumn', { static: false }) projectNameColumn: ElementRef;
  @ViewChild('projectOwnerColumn', { static: false }) projectOwnerColumn: ElementRef;
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  pageViewId = PageViewIds.Projects;

  globalFilterTemplates = {};
  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'UserSessions_Session_Name'
  }];
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  constructor(private store: Store<fromJobsPageReducer.State>) {
    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });
    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });
  }

  ngAfterViewInit() {
    this.globalFilterTemplates = {
      'PayMarket': { Template: this.payMarketFilter }
    };
    this.colTemplates = {
      'HasProjectAccess': { Template: this.projectAccessColumn },
      'Session_Name': { Template: this.projectNameColumn },
      'Create_User': { Template: this.projectOwnerColumn }
    };
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }
  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterValue = value.Id;
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
