import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit {

  @ViewChild('payMarketColumn', { static: false }) payMarketColumn: ElementRef;
  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('baseTccColumn', { static: false }) baseTccColumn: ElementRef;
  colTemplates = {};

  constructor() { }

  ngAfterViewInit() {
    this.colTemplates = {
      'PayMarket': this.payMarketColumn,
      'BaseMRP': this.baseMrpColumn,
      'TCCMRP': this.baseTccColumn
    };
  }

}
