import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfGridActions from 'libs/features/grids/pf-data-grid/actions';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromActions from 'libs/features/grids/pf-data-grid/actions';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { GroupedListItem } from 'libs/models/list';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';

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
  pfThemeType = PfThemeType;
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
  payMarketOptions: GroupedListItem[];
  selectedPayMarkets: string[];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  hasStructureDetailsFlagEnabled: boolean;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasStructureDetailsFlagEnabled = this.featureFlagService.enabled(FeatureFlags.StructureDetails, false);
    this.companyPayMarketSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        if (!!o) {
          this.payMarketOptions = cloneDeep(o);
        }
      });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket' && f.IsGlobalFilter);
        this.selectedPayMarkets = this.payMarketField.FilterValues === null ? [] : cloneDeep(this.payMarketField.FilterValues);
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
      'Structure_Search': { Template: this.nameColumn },
      'Mid': { Template: this.midColumn },
      'AvgEEComparatio': { Template: this.comparatioColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn }
    };
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketSubscription.unsubscribe();
  }

  closeExpandedRow(id: string, idValue: number) {
    this.store.dispatch(new fromActions.CollapseRowById(this.pageViewId, id, idValue));
  }

  handlePayMarketValueChanged(payMarkets: string[]) {
    const field: ViewField = cloneDeep(this.payMarketField);
    field.FilterValues = payMarkets?.length > 0 ? payMarkets : null;
    field.FilterOperator = 'in';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (!!field.FilterValues) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  getRefreshFilter(dataRow: any) {
    return {
      EntitySourceName: 'vw_CompanyJobsStructureInfo',
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [dataRow.vw_CompanyJobsStructureInfo_CompanyStructuresRanges_ID]
    };
  }

  public get rangeRecalculationType(): typeof RangeRecalculationType {
    return RangeRecalculationType;
  }
}
