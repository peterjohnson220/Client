import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { DataSummaryReportData, JobSummaryPrintData } from 'libs/models/comphub';
import { PricingForPayGraph } from 'libs/models/payfactors-api';
import { PricingGraphTypeEnum } from 'libs/features/pricings/job-pricing-graph/models/pricing-graph-type.enum';

import { PrintConstants } from '../../constants';
import * as fromComphubPrintReducer from '../../reducers';
import * as fromJobSummaryPrintActions from '../../actions';
import { DataCardHelper } from '../../../_shared/helpers';


@Component({
  selector: 'pf-job-summary-print',
  templateUrl: './job-summary-print.component.html',
  styleUrls: ['./job-summary-print.component.scss']
})
export class JobSummaryPrintComponent implements OnInit, OnDestroy {
  jobSummaryPrintData: JobSummaryPrintData;
  jobSummaryPrintDataSub: Subscription;
  reportId: string;
  loadingData: boolean;
  fullRenderComplete: boolean;
  dataSummaryReportsRenderComplete: boolean;
  dataSummaryReports: DataSummaryReportData[];
  leftDataSummaryReports: DataSummaryReportData[];
  rightDataSummaryReports: DataSummaryReportData[];
  pageTotal = 5;
  renderCount = 0;
  renderedCards = 0;
  readyForPdfGenerationSelector = PrintConstants.READY_FOR_PDF_GENERATION_SELECTOR;
  currentYear: number;
  basePayGraph: PricingForPayGraph;
  tccPayGraph: PricingForPayGraph;
  PricingGraphTypeEnum = PricingGraphTypeEnum;

  constructor(
    private store: Store<fromComphubPrintReducer.State>,
    private route: ActivatedRoute
  ) {
    this.reportId = this.route.snapshot.params.id;
    this.store.dispatch(new fromJobSummaryPrintActions.GetJobSummaryPrintData(this.reportId));
  }

  getLocation() {
    const location = [];
    if (this.jobSummaryPrintData.City != null) {
      location.push(this.jobSummaryPrintData.City);
    }
    if (this.jobSummaryPrintData.State != null) {
      location.push(this.jobSummaryPrintData.State);
    }
    if (this.jobSummaryPrintData.Country != null) {
      location.push(this.jobSummaryPrintData.Country);
    }

    return location.join(', ');
  }

  getSkills() {
    return this.jobSummaryPrintData.Skills.join(', ');
  }

  getCerts() {
    return this.jobSummaryPrintData.Certs.join(', ');
  }

  dataSummaryRenderComplete() {
    this.renderedCards++;
    if (this.renderedCards === this.dataSummaryReports.length) {
      this.dataSummaryReportsRenderComplete = true;
    }
  }

  handleRenderComplete(rendered: boolean) {
    if (rendered) {
      this.renderCount++;
      if (this.renderCount === this.pageTotal) {
        this.fullRenderComplete = true;
      }
    }
  }

  calculateDataByRate(value: number): number {
    return DataCardHelper.calculateDataByRate(value, false, true);
  }

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.loadingData = false;
    this.fullRenderComplete = false;
    this.dataSummaryReportsRenderComplete = false;
    this.jobSummaryPrintDataSub = this.store.select(fromComphubPrintReducer.getJobSummaryPrintDataAsyncObj).subscribe(data => {
      if (data && data.obj) {
        this.jobSummaryPrintData = data.obj;
        this.dataSummaryReports = this.jobSummaryPrintData.DataSummaryReports;
        if (this.dataSummaryReports) {
          const mid = this.dataSummaryReports.length / 2;
          this.leftDataSummaryReports = this.dataSummaryReports.slice(0, mid + 1);
          this.rightDataSummaryReports = this.dataSummaryReports.slice(mid + 1);
        }

        this.basePayGraph = {
          Pay10: this.calculateDataByRate(this.jobSummaryPrintData.Base10),
          Pay25: this.calculateDataByRate(this.jobSummaryPrintData.Base25),
          Pay50: this.calculateDataByRate(this.jobSummaryPrintData.Base50),
          Pay75: this.calculateDataByRate(this.jobSummaryPrintData.Base75),
          Pay90: this.calculateDataByRate(this.jobSummaryPrintData.Base90),
          PayAvg: this.calculateDataByRate(this.jobSummaryPrintData.BaseAvg),
          Currency: 'USD',
          Rate: 'Annual',  // TODO Use a real Rate here
          OverallMin: this.calculateDataByRate(this.jobSummaryPrintData.Base10),
          OverallMax: this.calculateDataByRate(this.jobSummaryPrintData.Total90)
        };

        this.tccPayGraph = {
          Pay10: this.calculateDataByRate(this.jobSummaryPrintData.Total10),
          Pay25: this.calculateDataByRate(this.jobSummaryPrintData.Total25),
          Pay50: this.calculateDataByRate(this.jobSummaryPrintData.Total50),
          Pay75: this.calculateDataByRate(this.jobSummaryPrintData.Total75),
          Pay90: this.calculateDataByRate(this.jobSummaryPrintData.Total90),
          PayAvg: this.calculateDataByRate(this.jobSummaryPrintData.TotalAvg),
          Currency: 'USD',
          Rate: 'Annual',  // TODO Use a real Rate here
          OverallMin: this.calculateDataByRate(this.jobSummaryPrintData.Base10),
          OverallMax: this.calculateDataByRate(this.jobSummaryPrintData.Total90)
        };
      }
    });
  }

  ngOnDestroy(): void {
    this.jobSummaryPrintDataSub.unsubscribe();
  }
}

