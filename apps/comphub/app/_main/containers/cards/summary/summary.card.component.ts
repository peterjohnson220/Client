import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';

import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { JobData, PricingPaymarket, JobSalaryTrend } from '../../../models';
import { ComphubPages, RateType } from '../../../data';
import { DataCardHelper } from '../../../helpers';

@Component({
  selector: 'pf-summary-card',
  templateUrl: './summary.card.component.html',
  styleUrls: ['./summary.card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnDestroy {
  @ViewChild('pdf') pdf: PDFExportComponent;
  selectedJobData$: Observable<JobData>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedRate$: Observable<RateType>;
  selectedPageId$: Observable<ComphubPages>;
  salaryTrendData$: Observable<JobSalaryTrend>;

  selectedJobDataSubscription: Subscription;
  selectedPaymarketSubscription: Subscription;
  selectedRateSubscription: Subscription;
  selectedPageIdSubscription: Subscription;
  salaryTrendSubscription: Subscription;

  jobData: JobData;
  jobSalaryTrendData: JobSalaryTrend;
  lastJobTrendFetched: JobData;
  paymarket: PricingPaymarket;
  defaultCurrency = 'USD';
  selectedRate: RateType;
  firstDayOfMonth: Date = DataCardHelper.firstDayOfMonth();

  constructor(
    private store: Store<fromComphubMainReducer.State>
  ) {
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedRate$ = this.store.select(fromComphubMainReducer.getSelectedRate);
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.salaryTrendData$ = this.store.select(fromComphubMainReducer.getSalaryTrendData);
  }

  ngOnInit() {
    this.selectedJobDataSubscription = this.selectedJobData$.subscribe(data => this.jobData = data);
    this.selectedPaymarketSubscription = this.selectedPaymarket$.subscribe(paymarket => this.paymarket = paymarket);
    this.selectedRateSubscription = this.selectedRate$.subscribe(r => this.selectedRate = r);
    this.selectedPageIdSubscription = this.selectedPageId$.subscribe(pageId => {
      if (pageId === ComphubPages.Summary) {
        this.loadJobTrendChart();
      }
    });
    this.salaryTrendSubscription = this.salaryTrendData$.subscribe(trendData => {
      this.jobSalaryTrendData = cloneDeep(trendData);
    });
  }

  ngOnDestroy() {
    this.selectedJobDataSubscription.unsubscribe();
    this.selectedPaymarketSubscription.unsubscribe();
    this.selectedRateSubscription.unsubscribe();
  }

  handlePriceNewJobClicked() {
    this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
  }

  handleDownloadPdfClicked() {
    this.pdf.saveAs(`PricingSummaryFor${this.cleanPdfName(this.jobData.JobTitle)}.pdf`);
  }

  get isHourly(): boolean {
    return (this.selectedRate === RateType.Hourly);
  }

  calculateDataByRate(value: number): number {
    return this.isHourly
      ? DataCardHelper.calculateDataByHourlyRate(value)
      : value;
  }

  private loadJobTrendChart() {
    if (this.jobData === this.lastJobTrendFetched || !this.jobData) {
      return;
    }
    this.lastJobTrendFetched = this.jobData;
    this.store.dispatch(new fromSummaryCardActions.GetNationalJobTrendData(this.jobData));
  }

  private cleanPdfName(jobTitle: string) {
    return jobTitle.replace(/ |\./g, '');
  }
}
