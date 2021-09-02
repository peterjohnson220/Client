import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { DataSummaryReportData, JobSummaryPrintData } from 'libs/models/comphub';

import { PrintConstants } from '../../constants';
import * as fromComphubPrintReducer from '../../reducers';
import * as fromJobSummaryPrintActions from '../../actions';


@Component({
  selector: 'pf-job-summary-print',
  templateUrl: './job-summary-print.component.html',
  styleUrls: ['./job-summary-print.component.scss']
})
export class JobSummaryPrintComponent implements OnInit, OnDestroy, AfterViewInit {
  jobSummaryPrintData: JobSummaryPrintData;
  jobSummaryPrintDataSub: Subscription;
  reportId: string;
  loadingData: boolean;
  fullRenderComplete = false;
  dataSummaryRenderComplete = false;
  dataSummaryReports: DataSummaryReportData[];
  leftDataSummaryReports: DataSummaryReportData[];
  rightDataSummaryReports: DataSummaryReportData[];
  pageTotal = 5;
  renderCount = 0;
  renderedCards = 0;
  readyForPdfGenerationSelector = PrintConstants.READY_FOR_PDF_GENERATION_SELECTOR;
  currentYear: number;

  constructor(
    private store: Store<fromComphubPrintReducer.State>,
    private route: ActivatedRoute
  ) {
    this.reportId = this.route.snapshot.params.id;
    this.store.dispatch(new fromJobSummaryPrintActions.GetJobSummaryPrintData(this.reportId));
  }

  handleRenderComplete(rendered: boolean) {
    if (rendered) {
      this.renderCount++;
      if (this.renderCount === this.pageTotal) {
        this.fullRenderComplete = true;
      }
    }
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

  onDataSummaryRenderComplete() {
    this.renderedCards++;
    if (this.renderedCards === this.dataSummaryReports.length) {
      this.dataSummaryRenderComplete = true;
    }
  }

  ngOnInit(): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.loadingData = false;
    this.jobSummaryPrintDataSub = this.store.select(fromComphubPrintReducer.getJobSummaryPrintDataAsyncObj).subscribe(data => {
      if (data && data.obj) {
        this.jobSummaryPrintData = data.obj;
        this.dataSummaryReports = this.jobSummaryPrintData.DataSummaryReports;
        if (this.dataSummaryReports) {
          const mid = this.dataSummaryReports.length / 2;
          this.leftDataSummaryReports = this.dataSummaryReports.slice(0, mid + 1);
          this.rightDataSummaryReports = this.dataSummaryReports.slice(mid + 1);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.renderCount === this.pageTotal) {
      this.fullRenderComplete = true;
    }
  }

  ngOnDestroy(): void {
    this.jobSummaryPrintDataSub.unsubscribe();
  }
}
