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
      this.loadChartDetail(e.category);
  }

  private legendClick(e): void {
    e.preventDefault(); // prevent default chart behavior of removing item from series

    if (e.series.data.filter(p => p.CategoryName === e.text)[ 0 ].CategoryValue > 0) {
      this.loadChartDetail(e.text);
    }
  }

  public chartBackButtonClick() {
    this.showChartDetail = false;
    this.chartComponentData = this.chartData;
  }

  public loadChartDetail(chartItem) {
    if (!this.showChartDetail) {

      this.chartData = this.chartComponentData;
      this.showChartDetail = true;

    this.chartComponentData = (<[ any ]>this.chartComponentData.filter(x => x.CategoryName === chartItem)[ 0 ].DetailData)
        .reduce((array, item) => {
          array.push({ CategoryValue: item.Value, CategoryName: item.Key });
          return array;
        }, []);
    }
  }
}
