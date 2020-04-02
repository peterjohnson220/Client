import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

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

  @ViewChild('notPricedDataPayMarketFilter', { static: false }) notPricedDataPayMarketFilter: ElementRef;
  @ViewChild('changeView', { static: false }) changeView: ElementRef;
  @ViewChild('sizeColumn', { static: false }) sizeColumn: ElementRef;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  selectedKeys: any[];
  payMarketOptions: any;
  actionBarConfig: ActionBarConfig;

  companyPayMarketsSubscription: Subscription;
  notPricedDataPageViewId = PageViewIds.NotPricedPayMarkets;
  notPricedDataGlobalFilterTemplates = {};
  notPricedDataColTemplates = {};
  notPricedDataGridFieldSubscription: Subscription;

  notPricedDataPayMarketField: ViewField;
  notPricedDataFilteredPayMarketOptions: any;
  notPricedDataSelectedPayMarket: any;

  constructor(private store: Store<fromJobsPageReducer.State>) {
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
      ActionBarClassName: 'not-priced-grid-action-bar ml-0 mt-1'
    };
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
