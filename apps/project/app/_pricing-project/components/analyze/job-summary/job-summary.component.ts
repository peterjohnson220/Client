import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import * as Highcharts from 'highcharts';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { UserContext } from 'libs/models/security';
import { OrdinalNumberPipe } from 'libs/core/pipes';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromRootState from 'libs/state/state';

import { PageViewIds } from '../../../../shared/constants';

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
  @Input() defaultPaymarket: string;
  @Output() showJobSummaryChange = new EventEmitter<boolean>();

  @ViewChild('baseMrpColumn', { static: false }) baseMrpColumn: ElementRef;
  @ViewChild('tccMrpColumn', { static: false }) tccMrpColumn: ElementRef;
  @ViewChild('companyColumn', { static: false }) companyColumn: ElementRef;
  @ViewChild('paymarketColumn', { static: false }) paymarketColumn: ElementRef;
  @ViewChild('compColumn', { static: false }) compColumn: ElementRef;
  @ViewChild('chart', { static: false }) chartTemplate: ElementRef;

  pagingOptions: PagingOptions = { From: 0, Count: 10 };
  columnHeaderTemplates = {};
  actionBarConfig: ActionBarConfig;

  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Job_Title'
  }, {
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Paymarket'
  }];

  userContext$: Observable<UserContext>;
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  chartInstance: Highcharts.Chart;

  chartOptions = {
    plotOptions: {
      bar: {
        grouping: true,
        groupPadding: 0.1,
        dataLabels: {},
        stacking: 'normal'
      },
      series: {
        states: {
          inactive: {
            opacity: 1
          }
        }
      }
    },
    chart: {
      type: 'bar',
      height: 350
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      reversed: true,
      borderRadius: 5,
      shadow: true,
      symbolRadius: 0,
      backgroundColor: '#FFFFFF'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: 'Base: {point.base} <br/>TCC: {point.tcc}'
    },
    xAxis: {
      categories: null
    },
    yAxis: {
      tickInterval: 10,
      min: 0,
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

  constructor(private store: Store<fromPfDataGridReducer.State>, private ordinalPipe: OrdinalNumberPipe) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
    };

  }
  ngOnInit(): void {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.dataRowsSubscription = this.store.select(fromPfDataGridReducer.getData, this.pageViewId).subscribe( data => {
      if (data) {
        this.setChartData(data);
      }
    });
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'comp': {Template: this.compColumn},
      'Paymarket': {Template: this.paymarketColumn},
    };

    this.columnHeaderTemplates = {
      'vw_ProjectJobPayMarketMetadata_BaseMRP': { Template: this.baseMrpColumn },
      'vw_ProjectJobPayMarketMetadata_TCCMRP': { Template: this.tccMrpColumn },
      'vw_ProjectJobPayMarketMetadata_EmpAvgBase': { Template: this.companyColumn },
      'vw_ProjectJobPayMarketMetadata_EmpAvgTCC': { Template: this.companyColumn },
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
    this.store.dispatch(new fromPfDataGridActions.ResetData(this.pageViewId));
  }

  setChartData(dataRows) {
    const cat = dataRows.data.map(d => d['vw_ProjectJobPayMarketMetadata_Job_Title']);
    const series = [{

      name: `Market TCC - ${this.ordinalPipe.transform(this.tccMrp)}`,
      data:  dataRows.data.map(d => ({y: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_TCCMRP'] - d['vw_ProjectJobPayMarketMetadata_BaseMRP']) / 1000 : d['vw_ProjectJobPayMarketMetadata_TCCMRP'] - d['vw_ProjectJobPayMarketMetadata_BaseMRP'],
        tcc: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_TCCMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_TCCMRP'],
        base: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_BaseMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_BaseMRP']
      })),

      color:  {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, '#F1DF4E'],
          [1, '#E9BB3D']
        ]
      }
    },
    {
      name: `Market Base - ${this.ordinalPipe.transform(this.baseMrp)}`,
      data:  dataRows.data.map(d => ({y: this.projectRate === 'Annual' ? d['vw_ProjectJobPayMarketMetadata_BaseMRP'] / 1000 : d['vw_ProjectJobPayMarketMetadata_BaseMRP'],
        tcc: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_TCCMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_TCCMRP'],
        base: this.projectRate === 'Annual' ? (d['vw_ProjectJobPayMarketMetadata_BaseMRP'] / 1000).toFixed(1) : d['vw_ProjectJobPayMarketMetadata_BaseMRP']
      })),
      color:  {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [0, '#4C5A6E'],
          [1, '#262E3D']
        ]
      }
    }];
    this.chartOptions.yAxis.tickInterval = this.projectRate === 'Annual' ? 10 : 5;
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
    this.chartOptions.series = [];
    this.updateFlag = true;
  }

}
