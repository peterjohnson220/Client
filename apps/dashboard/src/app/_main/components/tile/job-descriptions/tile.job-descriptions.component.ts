import { Component } from '@angular/core';
import 'hammerjs';

@Component({
  selector: 'pf-tile-job-descriptions',
  templateUrl: './tile.job-descriptions.component.html',
  styleUrls: [ './tile.job-descriptions.component.scss' ]
})

export class JobDescriptionsComponent {
  public chartComponentData: any[] = [];
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
        this.chartDetailData.push({ kind: 'Not Started Detail', share: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'Draft':
        console.log('Loading Draft Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ kind: 'Draft Detail', share: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'Published':
        console.log('Loading Published Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ kind: 'Published Detail', share: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
      case 'In Review':
        console.log('Loading In Review Detail');

        this.chartDetail = true;
        this.chartComponentData = [];
        this.chartDetailData = [];
        this.chartDetailData.push({ kind: 'In Review Detail', share: .122 });
        this.chartComponentData = this.chartDetailData;
        break;
    }

  }


  getTooltip(category) {
    return `data for ${category}`;
  }

  constructor() {
    this.chartData = [ {
      kind: 'Not Started', share: 0.175, color: '#4472C3', tooltip: 'Not Started: 0'
    }, {
      kind: 'Draft', share: 0.238, color: '#A3A3A3', tooltip: 'Draft: 2'
    }, {
      kind: 'Published', share: 0.118, color: '#5A99D3', tooltip: 'Published: 3'
    }, {
      kind: 'In Review', share: 0.052, color: '#264478', tooltip: 'In Review: 6'
    } ];

    this.chartComponentData = this.chartData;
  }
}
