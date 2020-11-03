import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { SortDescriptor } from '@progress/kendo-data-query';

import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import { RangeType } from 'libs/features/employee-management/models';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

import { PageViewIds } from '../../../../constants';
import * as fromJobsPageReducer from '../../../../reducers';

@Component({
  selector: 'pf-structure-grid',
  templateUrl: './structure-grid.component.html',
  styleUrls: ['./structure-grid.component.scss']
})
export class StructureGridComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];

  @ViewChild('nameColumn') nameColumn: ElementRef;
  @ViewChild('midColumn') midColumn: ElementRef;
  @ViewChild('comparatioColumn') comparatioColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('percentage') percentageColumn: ElementRef;

  pageViewId = PageViewIds.Structures;
  rangeTypeIds = RangeType;
  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_CompanyJobsStructureInfo_Structure_Search'
  }];
  fieldsExcludedFromExport = [
    'CompanyJob_ID',
    'CompanyPayMarket_ID',
    'CompanyStructuresRangeGroup_ID',
    'CompanyStructuresRanges_ID',
    'RangeTypeId',
    'Structure_Search'];
  gridFieldSubscription: Subscription;
  companyPayMarketSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  hasInfiniteScrollFeatureFlagEnabled: boolean;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.companyPayMarketSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket' && f.IsGlobalFilter);
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      AllowExport: true,
      ExportSourceName: 'Structures',
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled
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
      'Structure_Search': { Template: this.nameColumn },
      'Mid': {Template: this.midColumn},
      'AvgEEComparatio': {Template: this.comparatioColumn},
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn }
    };
  }
  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketSubscription.unsubscribe();
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

  getRefreshFilter(dataRow: any) {
    return {
      EntitySourceName: 'vw_CompanyJobsStructureInfo',
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [dataRow.vw_CompanyJobsStructureInfo_CompanyStructuresRanges_ID]
    };
  }
}
