import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';

import { SortDescriptor } from '@progress/kendo-data-query';

import * as cloneDeep from 'lodash.clonedeep';

import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobsPageReducer from '../../reducers';
import { PageViewIds } from '../../constants';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit, OnDestroy {
  @Input() filters: PfDataGridFilter[];
  @ViewChild('payMarketFilter', { static: false }) payMarketFilter: ElementRef;

  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('baseTccColumn', { static: false }) baseTccColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;

  pricingDetailsGridInboundFilterSourceNameWhiteList = ['CompanyJob_ID', 'PayMarket'];
  globalFilterTemplates = {};
  colTemplates = {};
  pageViewId = PageViewIds.PricingDetails;
  gridFieldSubscription: Subscription;
  companyPayMarketsSubscription: Subscription;
  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  payMarketOptions: any;
  selectedPayMarket: any;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  selectedKeys: number[];

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
      'PayMarket': { Template: this.payMarketColumn },
      'BaseMRP': { Template: this.baseMrpColumn },
      'TCCMRP': { Template: this.baseTccColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }

  ngOnDestroy() {
    this.gridFieldSubscription.unsubscribe();
    this.companyPayMarketsSubscription.unsubscribe();
  }

  handleFilter(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
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
}
