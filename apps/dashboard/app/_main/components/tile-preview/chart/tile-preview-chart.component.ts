import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import 'hammerjs';

import { TileTypes } from 'libs/models';

import { TilePreviewChart } from '../../../models';

@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: [ './tile-preview-chart.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartComponent implements OnChanges {
  @Input() model: TilePreviewChart;
  @Input() payscaleBrandingFeatureFlag = false;

  public chartData: any[] = [];

  showChartDetail = false;

  legendLabelStyle: any;
  limitLabelText: any;
  seriesItemHighlightStyle: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payscaleBrandingFeatureFlag) {
      this.legendLabelStyle = {
        padding: 3,
        font: 'bold 1rem',
        color: this.payscaleBrandingFeatureFlag ? '#312B36' : '#fff'
      };
      this.limitLabelText = {
        padding: 3,
        font: 'bold 1rem',
        color: this.payscaleBrandingFeatureFlag ? '#312B36' : '#fff',
        content: function(e) {
          if (e.text.length > 17) {
            return e.text.substring(0, 14) + '...';
          }
          return e.text;
        }
      };

      let chartHighlightColor = '#312B36';
      switch (this.model.TileType) {
        case TileTypes.Employees:
          chartHighlightColor = '#001F1D';
          break;
        case TileTypes.Surveys:
          chartHighlightColor = '#03394F';
          break;
        case TileTypes.JobDescriptions:
          chartHighlightColor = '#2A390E';
          break;
      }
      this.seriesItemHighlightStyle = {
        opacity: 1,
        color: this.payscaleBrandingFeatureFlag ? chartHighlightColor : '#fff',
        border: '#000'
      };
    }
  }

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
    if (!this.showChartDetail && this.model.ChartComponentData.filter(x => x.CategoryName === chartItem)[ 0 ].DetailData.length > 0) {
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
