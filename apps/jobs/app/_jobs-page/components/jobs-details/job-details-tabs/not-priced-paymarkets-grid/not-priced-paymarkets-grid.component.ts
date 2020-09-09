import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { getDefaultPagingOptions, PagingOptions } from 'libs/models/payfactors-api/search/request';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobsPageActions from '../../../../actions';
import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';

@Component({
  selector: 'pf-not-priced-paymarkets-grid',
  templateUrl: './not-priced-paymarkets-grid.component.html',
  styleUrls: ['./not-priced-paymarkets-grid.component.scss']
})
export class NotPricedPaymarketsGridComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];
  @Input() pricedCount: number;

  @ViewChild('notPricedDataPayMarketFilter') notPricedDataPayMarketFilter: ElementRef;
  @ViewChild('changeView') changeView: ElementRef;
  @ViewChild('sizeColumn') sizeColumn: ElementRef;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  selectedKeys: any[];
  payMarketOptions: any;
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  defaultPagingOptions: PagingOptions;

  companyPayMarketsSubscription: Subscription;
  notPricedDataPageViewId = PageViewIds.NotPricedPayMarkets;
  notPricedDataGlobalFilterTemplates = {};
  notPricedDataColTemplates = {};
  notPricedDataGridFieldSubscription: Subscription;

  notPricedDataPayMarketField: ViewField;
  notPricedDataFilteredPayMarketOptions: any;
  notPricedDataSelectedPayMarket: any;
  hasInfiniteScrollFeatureFlagEnabled: boolean;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.notPricedDataFilteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.notPricedDataGridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.notPricedDataPageViewId).subscribe(fields => {
      if (fields) {
        this.notPricedDataPayMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.notPricedDataSelectedPayMarket = this.notPricedDataPayMarketField.FilterValue !== null ?
          { Value: this.notPricedDataPayMarketField.FilterValue, Id: this.notPricedDataPayMarketField.FilterValue } : null;
      }
    });
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled
    };
    this.defaultPagingOptions = this.hasInfiniteScrollFeatureFlagEnabled
      ? getDefaultPagingOptions()
      : { From: 0, Count: 20 };
  }

  ngAfterViewInit() {
    this.notPricedDataColTemplates = {
      'Size_Value': { Template: this.sizeColumn }
    };
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.notPricedDataPayMarketFilter
      },
      GlobalActionsTemplate: this.changeView
    };
  }

  ngOnDestroy() {
    this.notPricedDataGridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
    }
  }

  handleFilter(value) {
    this.notPricedDataFilteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.notPricedDataPayMarketField);
    field.FilterOperator = '=';
    field.FilterValue = value.Id;

    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.notPricedDataPageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.notPricedDataPageViewId, field));
    }
  }

  switchViewToPriced() {
    this.store.dispatch(new fromJobsPageActions.ChangePricingDetailsView('Priced'));
  }
}
