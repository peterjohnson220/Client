import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, EventEmitter} from '@angular/core';
import * as Highcharts from 'highcharts';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {SortDescriptor} from '@progress/kendo-data-query';

import {GridConfig} from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import {PagingOptions} from 'libs/models/payfactors-api/search/request';

import {PageViewIds} from '../../../../shared/constants';


@Component({
  selector: 'pf-job-summary',
  templateUrl: './job-summary.component.html',
  styleUrls: ['./job-summary.component.scss']
})
export class JobSummaryComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() projectId: number;
  @Input() projectJobIds: [];
  @Input() showJobSummary: boolean;
  @Input() projectRate: string;
  @Input() baseMrp: number;
  @Input() tccMrp: number;
  @Output() showJobSummaryChange = new EventEmitter<boolean>();

  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('tccMrpColumn', { static: false }) tccMrpColumn: ElementRef;
  pagingOptions: PagingOptions = { From: 0, Count: 10 };
  columnHeaderTemplates: {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Job_Title'
  }, {
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Paymarket'
  }];
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartInstance: Highcharts.Chart;
  chartOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',

    },
    credits: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.actual}'
    },
    xAxis: {
      categories: null
    },
    yAxis: {
      title: {enabled: false},
    },
    series: null,
    title: null
  };
  updateFlag: boolean;
  gridConfig: GridConfig;
  filters = [];
  colTemplates = {};
  pageViewId = PageViewIds.ProjectJobSummary;
  dataRowsSubscription: Subscription;
  @ViewChild('compColumn', { static: false }) compColumn: ElementRef;
  @ViewChild('chart', { static: false }) chartTemplate: ElementRef;
  constructor(private store: Store<fromPfDataGridReducer.State>) {
    this.gridConfig = {
      PersistColumnWidth: true
    };
  }
  ngOnInit(): void {
    this.dataRowsSubscription = this.store.select(fromPfDataGridReducer.getData, this.pageViewId).subscribe( data => {
      if (data) {
       this.setChartData(data);
      }
    });
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'comp': {Template: this.compColumn}
    };

    this.columnHeaderTemplates = {
      'vw_ProjectJobPayMarketMetadata_BaseMRP': {Template: this.baseMrpColumn},
      'vw_ProjectJobPayMarketMetadata_TCCMRP': {Template: this.tccMrpColumn}
    };
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId']) {
      this.filters = (this.filters || []).filter(f => f.SourceName !== 'UserSession_ID');
      this.filters.push ({
        SourceName: 'UserSession_ID',
        Operator: '=',
        Values: [changes['projectId'].currentValue]
      });
    }
    if (changes['projectJobIds']) {
      this.filters = (this.filters || []).filter(f => f.SourceName !== 'UserJobListTemp_ID');
      if (changes['projectJobIds'].currentValue?.length !== 0) {
        this.filters.push({
          SourceName: 'UserJobListTemp_ID',
          Operator: 'in',
          Values: changes['projectJobIds'].currentValue
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.dataRowsSubscription.unsubscribe();
  }

  setChartData(dataRows) {
    const cat = dataRows.data.map(d => d['vw_ProjectJobPayMarketMetadata_Job_Title']);
    const series = [{

      name: 'Market TCC MRP',
      data:  dataRows.data.map(d => ({y: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_TCCMRP'] - d['vw_ProjectJobPayMarketMetadata_BaseMRP']) / 1000 : d['vw_ProjectJobPayMarketMetadata_TCCMRP'] - d['vw_ProjectJobPayMarketMetadata_BaseMRP'],
        actual: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_TCCMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_TCCMRP']})),
      color:  {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, '#F1DF4E'],
          [1, '#E9BB3D']
        ]
      }
    },
      {
        name: 'Market Base MRP',
        data:  dataRows.data.map(d => ({y: this.projectRate === 'Annual' ? d['vw_ProjectJobPayMarketMetadata_BaseMRP'] / 1000 : d['vw_ProjectJobPayMarketMetadata_BaseMRP'],
          actual: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_BaseMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_BaseMRP']})),
        color:  {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#4C5A6E'],
            [1, '#262E3D']
          ]
        }
    }
      ];
    this.chartOptions.xAxis.categories = cat;
    this.chartOptions.series = series;
    if (this.chartInstance) {
      this.updateFlag = true;
    }
  }

  rangeChartCallback(chart: Highcharts.Chart = null) {
    // set the instance
    if (chart) {
      this.chartInstance = chart;
    }
  }
  returnToProjectDetails() {
    this.showJobSummaryChange.emit(false);
  }

}
