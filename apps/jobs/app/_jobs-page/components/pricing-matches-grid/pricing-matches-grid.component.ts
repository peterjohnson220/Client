import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { PagingOptions } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-pricing-matches-grid',
  templateUrl: './pricing-matches-grid.component.html',
  styleUrls: ['./pricing-matches-grid.component.scss']
})
export class PricingMatchesGridComponent implements AfterViewInit, OnChanges {

  @Input() pricingInfo: any[];

  @ViewChild('jobTitleColumn', { static: false }) jobTitleColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;
  @ViewChild('wtgColumn', { static: false }) wtgColumn: ElementRef;
  @ViewChild('adjColumn', { static: false }) adjColumn: ElementRef;

  colTemplates = {};

  rate: string;
  filter: PfDataGridFilter = {
    SourceName: 'CompanyJobPricing_ID',
    Operator: '=',
    Value: ''
  };

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'vw_PricingMatchesJobTitlesMerged_Effective_Date'
  }];

  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 500
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.pricingInfo) {
      this.filter.Value = changes.pricingInfo.currentValue['CompanyJobs_Pricings_CompanyJobPricing_ID'];
      this.rate = changes.pricingInfo.currentValue['CompanyJobs_Pricings_Rate'];
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': { Template: this.jobTitleColumn },
      'Match_Weight': {
        Template: this.wtgColumn,
        IsCompact: true
      },
      'Match_Adjustment': {
        Template: this.adjColumn,
        IsCompact: true
      },
      [PfDataGridColType.currency]: { Template: this.currencyColumn }
    };
  }

  getPageViewId() {
    return this.filter ? `229B0067-8144-4847-ACF9-69C24CA16285_${this.filter.Value}` : null;
  }
}
