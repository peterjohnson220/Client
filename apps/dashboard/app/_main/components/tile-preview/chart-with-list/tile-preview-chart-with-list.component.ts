import * as cloneDeep from 'lodash.clonedeep';

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

  ngOnInit() {
    this.chartData = cloneDeep(this.model.TileChartData);

    if ( this.hasValidResponses() ) { this.chartData.forEach(x => {
        if (x.Percentage === 0) { x.Percentage = this.MIN_CHART_DISPLAY_VALUE; }}); // to render in the chart
    }
  }

  navigateToPost(): void {
    window.location.href  = this.model.PostUrl;
  }

  createPoll() {
    window.location.href  = this.model.BaseUrl + '?type=poll';
  }

  hasValidResponses(): boolean {
    return this.model.TileChartData ? this.model.TileChartData.find(x => x.Percentage > 0) : false;
  }

  getPercentage(value): number {
    return value === this.MIN_CHART_DISPLAY_VALUE ? 0 : value;
  }

}

