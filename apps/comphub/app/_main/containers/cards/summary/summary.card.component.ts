import { Component, OnInit, OnDestroy, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CurrencyPipe, getCurrencySymbol } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as cloneDeep from 'lodash.clonedeep';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { pdf } from '@progress/kendo-drawing';
const { exportPDF } = pdf;
import * as isEqual from 'lodash.isequal';

import { SharePricingSummaryRequest } from 'libs/models/payfactors-api';
import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { SystemUserGroupNames } from 'libs/constants';
import { RateType } from 'libs/data/data-sets';

import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { JobData, PricingPaymarket, JobSalaryTrend, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';
import { DataCardHelper } from '../../../helpers';

@Component({
  selector: 'pf-summary-card',
  templateUrl: './summary.card.component.html',
  styleUrls: ['./summary.card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('pdf', { static: true }) pdf: PDFExportComponent;
  @Input() workflowContext: WorkflowContext;

  selectedJobData$: Observable<JobData>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedRate$: Observable<RateType>;
  salaryTrendData$: Observable<JobSalaryTrend>;
  sharePricingSummaryModalOpen$: Observable<boolean>;
  sharePricingSummaryError$: Observable<boolean>;
  sharePricingSummaryConflict$: Observable<boolean>;
  creatingProject$: Observable<boolean>;
  creatingProjectError$: Observable<boolean>;
  canAccessProjectsTile$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  glossaryOpen$: Observable<boolean>;
  minPaymarketMinimumWage$: Observable<number>;
  maxPaymarketMinimumWage$: Observable<number>;

  selectedJobDataSubscription: Subscription;
  selectedPaymarketSubscription: Subscription;
  selectedRateSubscription: Subscription;
  salaryTrendSubscription: Subscription;

  jobData: JobData;
  lastJobData: JobData;
  jobSalaryTrendData: JobSalaryTrend;
  paymarket: PricingPaymarket;
  selectedRate: RateType;
  firstDayOfMonth: Date = DataCardHelper.firstDayOfMonth();
  systemUserGroupNames = SystemUserGroupNames;
  comphubPages = ComphubPages;
  currencySymbol: string;

  constructor(
    private store: Store<fromComphubMainReducer.State>, public cp: CurrencyPipe
  ) {
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedRate$ = this.store.select(fromComphubMainReducer.getSelectedRate);
    this.salaryTrendData$ = this.store.select(fromComphubMainReducer.getSalaryTrendData);
    this.sharePricingSummaryModalOpen$ = this.store.select(fromComphubMainReducer.getSharePricingSummaryModalOpen);
    this.sharePricingSummaryError$ = this.store.select(fromComphubMainReducer.getSharePricingSummaryError);
    this.sharePricingSummaryConflict$ = this.store.select(fromComphubMainReducer.getSharePricingSummaryConflict);
    this.creatingProject$ = this.store.select(fromComphubMainReducer.getCreatingProject);
    this.creatingProjectError$ = this.store.select(fromComphubMainReducer.getCreatingProjectError);
    this.canAccessProjectsTile$ = this.store.select(fromComphubMainReducer.getCanAccessProjectsTile);
    this.glossaryOpen$ = this.store.select(fromComphubMainReducer.getGlossaryOpen);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.minPaymarketMinimumWage$ = this.store.select(fromComphubMainReducer.getMinPaymarketMinimumWage);
    this.maxPaymarketMinimumWage$ = this.store.select(fromComphubMainReducer.getMaxPaymarketMinimumWage);
  }

  ngOnInit() {
    this.selectedJobDataSubscription = this.selectedJobData$.subscribe(data => this.jobData = data);
    this.selectedPaymarketSubscription = this.selectedPaymarket$.subscribe(paymarket => this.paymarket = paymarket);
    this.selectedRateSubscription = this.selectedRate$.subscribe(r => this.selectedRate = r);
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
    this.lastJobData = null;
    this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
  }

  handleDownloadPdfClicked() {
    this.pdf.saveAs(this.getPDFFileName());
  }

  handleShareClicked() {
    this.store.dispatch(new fromSummaryCardActions.OpenShareModal());
  }

  handleShareModalCancelClicked() {
    this.store.dispatch(new fromSummaryCardActions.CloseShareModal());
  }

  handleShareModalSendClicked(toEmail: string) {
    this.pdf.export().then((group) => {
      exportPDF(group).then((data) => {
        data = data.replace('data:application/pdf;base64,', '');
        const request: SharePricingSummaryRequest = {
          JobTitle: this.jobData.JobTitle,
          ToEmail: toEmail,
          AttachmentFileName: this.getPDFFileName(),
          AttachmentContent: data
        };
        this.store.dispatch(new fromSummaryCardActions.SharePricingSummary(request));
      });
    });
  }

  handleCreateProjectClicked() {
    this.store.dispatch(new fromSummaryCardActions.CreateProject());
  }

  handleGlossaryClicked() {
    this.store.dispatch(new fromSummaryCardActions.ToggleGlossaryDisplay({ open: true }));
  }

  handleGlossaryClosed() {
    this.store.dispatch(new fromSummaryCardActions.ToggleGlossaryDisplay({ open: false }));
  }

  getPaymarketMinimumWage(minPaymarketMinWage: number, maxPaymarketMinWage: number, currencyCode: string): any {
    if (minPaymarketMinWage === maxPaymarketMinWage && minPaymarketMinWage !== null) {
      return this.cp.transform(minPaymarketMinWage, currencyCode, 'symbol-narrow');
    }
    if (minPaymarketMinWage < maxPaymarketMinWage) {
      return this.cp.transform(minPaymarketMinWage, currencyCode, 'symbol-narrow')
        + ' - ' + this.cp.transform(maxPaymarketMinWage, currencyCode, 'symbol-narrow');
    }
    return '-';
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
    this.store.dispatch(new fromSummaryCardActions.GetNationalJobTrendData(this.jobData));
  }

  private addNewCompletedPricingHistoryRecord() {
    this.store.dispatch(new fromSummaryCardActions.AddCompletedPricingHistory(this.jobData));
  }

  private getPDFFileName(): string {
    return `PricingSummaryFor${this.jobData.JobTitle.replace(/ |\./g, '')}.pdf`;
  }

  private jobDataHasChanged(): boolean {
    return (!!this.jobData && !isEqual(this.jobData, this.lastJobData));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.workflowContext || !changes.workflowContext.currentValue) {
      return;
    }
    if (changes.workflowContext.currentValue.selectedPageId === this.comphubPages.Summary &&
      this.jobDataHasChanged()) {
      this.lastJobData = this.jobData;
      this.loadJobTrendChart();
      this.addNewCompletedPricingHistoryRecord();
      this.currencySymbol = getCurrencySymbol(this.workflowContext.activeCountryDataSet.CurrencyCode, 'narrow');
    }
  }
}
