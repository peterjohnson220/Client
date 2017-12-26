import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TilePreviewChart } from '../../../models';

import 'hammerjs';


@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: [ './tile-preview-chart.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartComponent {
  @Input() iconClass: string;
  @Input() chartComponentData: TilePreviewChart[];
  @Input() chartType: string;

  public chartDetailData: any[] = [];
  public chartData: any[] = [];

  showChartDetail = false;

  private labels: any = {
    padding: 3,
    font: 'bold 1rem',
    color: '#fff'
  };

  private highlight: any = {
    opacity: 1,
    border: '#000'
  };

  private onSeriesClick(e): void {
    this.loadChartDetail(e.category);
  }

  private onLegendClick(e): void {
    e.preventDefault();

    this.loadChartDetail(e.text);
  }

  private onChartBackButtonClick() {
    this.showChartDetail = false;
    this.chartComponentData = this.chartData;
  }

  private loadChartDetail(chartItem) {
    if (!this.showChartDetail) {

      this.chartData = this.chartComponentData;
      this.showChartDetail = true;
      this.chartDetailData = this.chartComponentData.filter(x => x.CategoryName === chartItem)[ 0 ].DetailData;

      const previewChartArray: TilePreviewChart[] = [];
      for (const item of this.chartDetailData) {
        const previewChartItem: TilePreviewChart = { CategoryValue: item.Value, CategoryName: item.Key };
        previewChartArray.push(previewChartItem);
      }

      this.chartComponentData = previewChartArray;
    }
  }

  getTooltip(category) {
    return `data for ${category}`;
  }

}
