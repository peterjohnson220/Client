import { Component, ViewChild, AfterViewInit, ElementRef, Input } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-pricing-history',
  templateUrl: './pricing-history.component.html',
  styleUrls: ['./pricing-history.component.scss']
})
export class PricingHistoryComponent implements AfterViewInit {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('viewPricingColumn', { static: false }) viewPricingColumn: ElementRef;
  @ViewChild('createUserColumn', { static: false }) createUserColumn: ElementRef;

  colTemplates = {};

  pageViewId = 'c4c03aff-4164-4a47-800f-97f0fee46623';

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'CompanyJobPricing_ID': this.viewPricingColumn,
      'Create_User': this.createUserColumn
    };
  }

  onRemove(event: any) {
    console.log(event);
  }
}
