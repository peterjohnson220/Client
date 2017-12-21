import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import 'hammerjs';

@Component({
  selector: 'pf-tile-preview-chart',
  templateUrl: './tile-preview-chart.component.html',
  styleUrls: [ './tile-preview-chart.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TilePreviewChartComponent {
  @Input() iconClass: string;
  @Input() chartComponentData: any[];

  public chartData: any[] = [];
  public chartDetailData: any[] = [];
  chartDetail = false;

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
    console.log(e.category + ' onSeriesClick');

    this.loadChartDetail(e.category);
  }

  private onLegendClick(e): void {
    console.log(e.text + ' legend click');
    e.preventDefault();

    this.loadChartDetail(e.text);
  }

  private onChartBackButtonClick() {
    console.log('Back button click');
    this.chartDetail = false;
    this.chartComponentData = this.chartData;
  }

  private loadChartDetail(chartItem) {
    switch (chartItem) {
      case 'Not Started':
        console.log('Loading Not Started Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ categoryName: 'Not Started Detail', dataValue: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'Draft':
        console.log('Loading Draft Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ categoryName: 'Draft Detail', dataValue: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'Published':
        console.log('Loading Published Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ categoryName: 'Published Detail', dataValue: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'In Review':
        console.log('Loading In Review Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ categoryName: 'In Review Detail', dataValue: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
    }
  }


  getTooltip(category) {
    return `data for ${category}`;
  }

  constructor() {
    this.chartData = [ {
      categoryName: 'Not Started', categoryField: 0.175, field: '#4472C3'
    }, {
      categoryName: 'Draft', categoryField: 0.238, field: '#A3A3A3'
    }, {
      categoryName: 'Published', categoryField: 0.118, field: '#5A99D3'
    }, {
      categoryName: 'In Review', categoryField: 0.052, field: '#264478'
    } ];

  }
}
