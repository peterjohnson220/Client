import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import 'hammerjs';

import { TilePreviewChart } from '../../../models';

@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: [ './tile-preview-chart.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartComponent {
  @Input() model: TilePreviewChart;

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

  public seriesClick(e): void {
    this.loadChartDetail(e.category);
  }

  public legendClick(e): void {
    e.preventDefault(); // prevent default chart behavior of removing item from series

    if (e.series.data.filter(p => p.CategoryName === e.text)[ 0 ].CategoryValue > 0) {
      this.loadChartDetail(e.text);
    }
  }

  public chartBackButtonClick() {
    this.showChartDetail = false;
    this.model.ChartComponentData = this.chartData;
  }

  public loadChartDetail(chartItem) {
    if (!this.showChartDetail) {

      this.chartData = this.model.ChartComponentData;
      this.showChartDetail = true;

      this.model.ChartComponentData = (<[ any ]>this.model.ChartComponentData.filter(x => x.CategoryName === chartItem)[ 0 ].DetailData)
        .reduce((array, item) => {
          array.push({ CategoryValue: item.Value, CategoryName: item.Key });
          return array;
        }, []);
    }
  }
}
