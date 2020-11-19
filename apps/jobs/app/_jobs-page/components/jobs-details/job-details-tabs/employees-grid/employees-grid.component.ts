import { Component, ViewChild, AfterViewInit, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import cloneDeep from 'lodash/cloneDeep';

import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/pf-data-grid/enums/pf-theme-type.enum';
import * as fromActions from 'libs/features/pf-data-grid/actions';

import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants/';

@Component({
  selector: 'pf-employees-grid',
  templateUrl: './employees-grid.component.html',
  styleUrls: ['./employees-grid.component.scss']
})
export class EmployeesGridComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];
  @ViewChild('employeeColumn') employeeColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('percentMrpColumn') percentMrpColumn: ElementRef;

  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;

  fieldsExcludedFromExport = ['CompanyEmployee_ID', 'CompanyJob_ID', 'CompanyPayMarket_ID', 'Employees', 'HiddenRate'];
  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket', 'Employees'];
  globalFilterTemplates = {};
  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyEmployees_Employees'
  }];

  pageViewId = PageViewIds.Employees;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  hasEmployeeDetailsFlagEnabled: boolean;
  pfThemeType = PfThemeType;

  constructor(
    private store: Store<fromPfGridReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasEmployeeDetailsFlagEnabled = this.featureFlagService.enabled(FeatureFlags.EmployeeDetails, false);
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
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      AllowExport: true,
      ExportSourceName: 'Employees',
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.payMarketFilter
      }
    };
    this.colTemplates = {
      'Employees': { Template: this.employeeColumn },
      'BaseSalaryMarketIndex': { Template: this.percentMrpColumn },
      'TotalCashCompensationMarketIndex': { Template: this.percentMrpColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
    }
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }

  closeExpandedRow(Id: string, IdValue: number) {
    this.store.dispatch(new fromActions.CollapseRowById(this.pageViewId, Id, IdValue));
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
