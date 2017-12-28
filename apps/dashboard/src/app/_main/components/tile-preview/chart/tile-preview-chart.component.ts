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
  @Input() chartComponentData: TilePreviewChart[];
  @Input() chartType: string;
  @Input() chartLabel: string;

  public chartDetailData: any[] = [];
  public chartData: any[] = [];

  showChartDetail = false;

  private legendlabelStyle: any = {
    padding: 3,
    font: 'bold 1rem',
    color: '#fff'
  };

  private seriesItemHighlightStyle: any = {
    opacity: 1,
    color: '#fff',
    border: '#000'
  };

  private seriesClick(e): void {
    if (e.value > 0) {
      this.loadChartDetail(e.category);
    }
  }

  private legendClick(e): void {
    e.preventDefault();

    if (e.series.data.filter(p => p.CategoryName === e.text)[0].CategoryValue > 0) {
      this.loadChartDetail(e.text);
    }
  }

  private chartBackButtonClick() {
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
}
