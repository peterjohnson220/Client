import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataViewFilter } from 'libs/models/payfactors-api';
import { JobsHelpers } from '../../helpers/jobs.helpers';
import * as cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit, OnChanges {

  @Input() filters: DataViewFilter[];

  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('baseTccColumn', { static: false }) baseTccColumn: ElementRef;

  refinedFilters: DataViewFilter[];
  colTemplates = {};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.refinedFilters = cloneDeep(changes['filters'].currentValue);
      JobsHelpers.updateJobIdFilter(this.refinedFilters, 'CompanyJob_ID', 'CompanyJobs_Pricings');
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'PayMarket': this.payMarketColumn,
      'BaseMRP': this.baseMrpColumn,
      'TCCMRP': this.baseTccColumn
    };
  }
}
