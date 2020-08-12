import cloneDeep from 'lodash/cloneDeep';

import { Component, Input, OnInit } from '@angular/core';

import { TilePreviewCharWithList } from '../../../models';

@Component({
  selector: 'pf-tile-preview-chart-with-list',
  templateUrl: './tile-preview-chart-with-list.component.html',
  styleUrls: [ './tile-preview-chart-with-list.component.scss' ]
})
export class TilePreviewChartWithListComponent  implements OnInit {

  @Input() model: TilePreviewCharWithList;
  chartData: any;
  MIN_CHART_DISPLAY_VALUE = 2.0001;
  MAX_TEXT_LENGTH = 55;

  get details(): string {
    if (!this.model.TileChartData) {
      return '';
    }
    return  this.model.TileChartData.Details.length > this.MAX_TEXT_LENGTH ?
     this.model.TileChartData.Details.substr(0, this.MAX_TEXT_LENGTH) + '...' : this.model.TileChartData.Details;
  }

  get hasChartItems(): boolean {
    return  this.model.TileChartData &&  this.model.TileChartData.TileChartItems.length > 0;
  }

  get detailsToolTip(): string {
    return this.model.TileChartData.Details.length > this.MAX_TEXT_LENGTH ?
    this.model.TileChartData.Details : '';
  }

  ngOnInit() {
    this.chartData = cloneDeep(this.model.TileChartData);

    if ( this.chartData && this.hasData() ) { this.chartData.TileChartItems.forEach(x => {
        if (x.Percentage === 0) { x.Percentage = this.MIN_CHART_DISPLAY_VALUE; }}); // to render in the chart
    }
  }

  navigate(): void {
    window.location.href  = this.model.PostUrl;
  }

  action() {
    window.location.href  = this.model.BaseUrl + '?type=' + this.model.ActionItemType;
  }

  hasData(): boolean {
    return this.model.TileChartData ? this.model.TileChartData.TileChartItems.find(x => x.Percentage > 0) : false;
  }

  getPercentage(value): number {
    return value === this.MIN_CHART_DISPLAY_VALUE ? 0 : value;
  }
}

