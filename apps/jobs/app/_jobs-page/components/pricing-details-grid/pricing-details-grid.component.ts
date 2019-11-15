import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('baseTccColumn', { static: false }) baseTccColumn: ElementRef;

  colTemplates = {};

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'PayMarket': this.payMarketColumn,
      'BaseMRP': this.baseMrpColumn,
      'TCCMRP': this.baseTccColumn
    };
  }
}
