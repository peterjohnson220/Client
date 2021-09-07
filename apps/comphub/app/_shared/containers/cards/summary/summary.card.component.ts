import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { CurrencyPipe, getCurrencySymbol } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { pdf } from '@progress/kendo-drawing';
const { exportPDF } = pdf;
import isEqual from 'lodash/isEqual';

import { SearchFilterOption, SharePricingSummaryRequest } from 'libs/models/payfactors-api';
import { UserContext } from 'libs/models/security';
import { ComphubType, SystemUserGroupNames } from 'libs/constants';
import { RateType, Rates, WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { KendoDropDownItem } from 'libs/models/kendo';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeMapSummary } from 'libs/models/peer';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { JobData, PricingPaymarket } from 'libs/models/comphub';
import * as fromRootReducer from 'libs/state/state';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';

import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubSharedReducer from '../../../reducers';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { JobSalaryTrend, WorkflowContext } from '../../../models';
import { DataCardHelper, MapHelper } from '../../../helpers';
import { ComphubPages } from '../../../data';


@Component({
  selector: 'pf-summary-card',
  templateUrl: './summary.card.component.html',
  styleUrls: ['./summary.card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnDestroy {
  @Input() pageId = ComphubPages.Summary;

  @ViewChild('pdf', { static: true }) pdf: PDFExportComponent;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  selectedJobData$: Observable<JobData>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedRate$: Observable<RateType>;
  salaryTrendData$: Observable<JobSalaryTrend>;
  sharePricingSummaryModalOpen$: Observable<boolean>;
  sendingQuickPriceShareEmail$: Observable<boolean>;
  sharePricingSummaryError$: Observable<boolean>;
  sharePricingSummaryConflict$: Observable<boolean>;
  creatingProject$: Observable<boolean>;
  creatingProjectError$: Observable<boolean>;
  canAccessProjectsTile$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  glossaryOpen$: Observable<boolean>;
  minPaymarketMinimumWage$: Observable<number>;
  maxPaymarketMinimumWage$: Observable<number>;
  filterContext$: Observable<any>;
  workflowContext$: Observable<WorkflowContext>;
  mapSummary$: Observable<ExchangeMapSummary>;
  calculatingJobData$: Observable<boolean>;
  showJobsHistorySummary$: Observable<boolean>;
  enableFileDownloadSecurityWarning$: Observable<boolean>;

  selectedJobDataSubscription: Subscription;
  selectedPaymarketSubscription: Subscription;
  selectedRateSubscription: Subscription;
  filterContextSubscription: Subscription;
  workflowContextSubscription: Subscription;
  showJobHistorySummarySubscription: Subscription;
  enableFileDownloadSecurityWarningSub: Subscription;
  private userContextSubscription: Subscription;

  jobData: JobData;
  lastJobData: JobData;
  jobSalaryTrendData: JobSalaryTrend;
  paymarket: PricingPaymarket;
  lastPaymarket: PricingPaymarket;
  selectedRate: RateType;
  firstDayOfMonth: Date = DataCardHelper.firstDayOfMonth();
  currentDate: Date = new Date();
  systemUserGroupNames = SystemUserGroupNames;
  comphubPages = ComphubPages;
  currencySymbol: string;
  filterContext: any;
  workflowContext: WorkflowContext;
  isPeerComphubType = false;
  filterContextHasFilters = false;
  rates: KendoDropDownItem[] = Rates;
  showJobHistorySummary: boolean;
  currencyCode: string;
  countryCode: string;
  enableFileDownloadSecurityWarning = false;

  private mbAccessToken: string;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    private settingsService: SettingsService,
    public cp: CurrencyPipe
  ) {
    this.selectedJobData$ = this.store.select(fromComphubSharedReducer.getSelectedJobData);
    this.selectedPaymarket$ = this.store.select(fromComphubSharedReducer.getSelectedPaymarket);
    this.selectedRate$ = this.store.select(fromComphubSharedReducer.getSelectedRate);
    this.salaryTrendData$ = this.store.select(fromComphubSharedReducer.getSalaryTrendData);
    this.sharePricingSummaryModalOpen$ = this.store.select(fromComphubSharedReducer.getSharePricingSummaryModalOpen);
    this.sendingQuickPriceShareEmail$ = this.store.select(fromComphubSharedReducer.getSendingQuickPriceShareEmail);
    this.sharePricingSummaryError$ = this.store.select(fromComphubSharedReducer.getSharePricingSummaryError);
    this.sharePricingSummaryConflict$ = this.store.select(fromComphubSharedReducer.getSharePricingSummaryConflict);
    this.creatingProject$ = this.store.select(fromComphubSharedReducer.getCreatingProject);
    this.creatingProjectError$ = this.store.select(fromComphubSharedReducer.getCreatingProjectError);
    this.canAccessProjectsTile$ = this.store.select(fromComphubSharedReducer.getCanAccessProjectsTile);
    this.glossaryOpen$ = this.store.select(fromComphubSharedReducer.getGlossaryOpen);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.minPaymarketMinimumWage$ = this.store.select(fromComphubSharedReducer.getMinPaymarketMinimumWage);
    this.maxPaymarketMinimumWage$ = this.store.select(fromComphubSharedReducer.getMaxPaymarketMinimumWage);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.mapSummary$ = this.exchangeExplorerStore.select(fromLibsPeerExchangeExplorerReducers.getPeerMapSummary);
    this.calculatingJobData$ = this.store.select(fromComphubSharedReducer.getRecalculatingJobData);
    this.showJobsHistorySummary$ = this.store.select(fromComphubSharedReducer.getShowJobPricedHistorySummary);
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
  }

  ngOnInit() {
    this.selectedJobDataSubscription = this.selectedJobData$.subscribe(data => this.jobData = data);
    this.selectedPaymarketSubscription = this.selectedPaymarket$.subscribe(paymarket => this.paymarket = paymarket);
    this.selectedRateSubscription = this.selectedRate$.subscribe(r => this.selectedRate = r);
    this.showJobHistorySummarySubscription = this.showJobsHistorySummary$.subscribe(x => this.showJobHistorySummary = x);
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      if (!!wfc && wfc.selectedPageId === ComphubPages.Summary) {
        this.workflowContext = wfc;
        this.isPeerComphubType = wfc.comphubType === ComphubType.PEER;
        if (this.showJobHistorySummary && this.pageId === ComphubPages.SummaryHistory) {
          this.updateSummaryHistoryData();
        } else if (!this.showJobHistorySummary && this.pageId === ComphubPages.Summary) {
          this.onWorkflowContextChanges();
        }
      }
    });
    this.userContextSubscription = this.userContext$.subscribe(uc => {
      this.mbAccessToken = uc.MapboxAccessToken;
    });
    this.enableFileDownloadSecurityWarningSub = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }

  ngOnDestroy() {
    this.selectedJobDataSubscription.unsubscribe();
    this.selectedPaymarketSubscription.unsubscribe();
    this.selectedRateSubscription.unsubscribe();
    this.showJobHistorySummarySubscription.unsubscribe();
    if (this.isPeerComphubType && this.filterContextSubscription) {
      this.filterContextSubscription.unsubscribe();
    }
    this.workflowContextSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSub.unsubscribe();
  }

  getWeightingType(type: string): string {
    if (type === WeightType.Org) {
      return WeightTypeDisplayLabeled.Org;
    } else if (type === WeightType.Inc) {
      return WeightTypeDisplayLabeled.Inc;
    } else {
      return '-';
    }
  }

  handlePriceNewJobClicked() {
    this.lastJobData = null;
    if (this.isPeerComphubType) {
      this.store.dispatch(new fromSummaryCardActions.PriceNewPeerJob());
    } else {
      this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
    }
  }

  handleDownloadPdfClicked() {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.pdf.saveAs(this.getPDFFileName());
    }
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.pdf.saveAs(this.getPDFFileName());
    }
  }

  handleShareClicked() {
    this.store.dispatch(new fromSummaryCardActions.OpenShareModal());
  }

  handleShareModalCancelClicked() {
    this.store.dispatch(new fromSummaryCardActions.CloseShareModal());
  }

  handleShareModalSendClicked(event: { emailAddress: string, note: string }) {
    this.pdf.export().then((group) => {
      exportPDF(group).then((data) => {
        data = data.replace('data:application/pdf;base64,', '');
        const request: SharePricingSummaryRequest = {
          JobTitle: this.jobData.JobTitle,
          ToEmail: event.emailAddress,
          AttachmentFileName: this.getPDFFileName(),
          AttachmentContent: data,
          Note: event.note
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
    const countryCode: string = this.showJobHistorySummary
      ? this.jobData.PayMarket.CountryCode
      : this.workflowContext.activeCountryDataSet.CountryCode;
    this.store.dispatch(new fromSummaryCardActions.GetNationalJobTrendData({ countryCode, jobCode: this.jobData.JobCode }));
  }

  private loadPeerQuickPriceData() {
    this.store.dispatch(new fromDataCardActions.GetPeerQuickPriceData());
  }

  private getPDFFileName(): string {
    return `PricingSummaryFor${this.jobData.JobTitle.replace(/ |\./g, '')}.pdf`;
  }

  private jobHasChanged(): boolean {
    return (!!this.jobData && !isEqual(this.jobData.JobId, this.lastJobData?.JobId));
  }

  private paymarketHasChanged(): boolean {
    return (!!this.paymarket && !isEqual(this.lastPaymarket?.CompanyPayMarketId, this.paymarket?.CompanyPayMarketId));
  }

  getPeerMapSrcString() {
    return MapHelper.getMapUrl(this.mbAccessToken, this.filterContext);
  }

  getFilterString(options: SearchFilterOption[]): string {
    let optionsStr = '';
    for (const option of options) {
      optionsStr += option.Name + ', ';
    }
    return optionsStr.replace(/,\s*$/, '');
  }

  onWorkflowContextChanges(): void {
    if (!this.isPeerComphubType) {
      this.store.dispatch(new fromSummaryCardActions.RecalculateJobData());
      if (this.jobHasChanged()) {
        this.loadJobTrendChart();
      }
      this.lastPaymarket = this.paymarket;
      this.lastJobData = this.jobData;
      this.currencyCode = this.workflowContext.activeCountryDataSet.CurrencyCode;
      this.countryCode = this.workflowContext.activeCountryDataSet.CountryCode;
      this.currencySymbol = getCurrencySymbol(this.workflowContext.activeCountryDataSet.CurrencyCode, 'narrow');
    } else if (this.isPeerComphubType) {
      this.store.dispatch(new fromComphubPageActions.RemoveAccessiblePages([ComphubPages.Jobs, ComphubPages.Markets, ComphubPages.Data]));
      this.lastJobData = this.jobData;
      this.loadPeerQuickPriceData();
      this.filterContext$ = this.exchangeExplorerContextService.selectFilterContext();
      this.filterContextSubscription = this.filterContext$.subscribe(fc => {
        this.filterContext = fc;
        this.filterContextHasFilters = fc.Filters.filter(x => x.Options.length > 0).length > 0;
      });
      this.currencyCode = this.paymarket.CurrencyCode;
      this.currencySymbol = getCurrencySymbol(this.paymarket.CurrencyCode, 'narrow');
    }
  }

  handleRateSelectionChange(type: KendoDropDownItem) {
    const selectedRateType = RateType[type.Value];
    this.store.dispatch(new fromDataCardActions.SetSelectedRate(selectedRateType));
  }

  private updateSummaryHistoryData(): void {
    this.paymarket = this.jobData.PayMarket;
    this.currencyCode = this.paymarket.CurrencyCode;
    this.countryCode = this.paymarket.CountryCode;
    this.currencySymbol = getCurrencySymbol(this.paymarket.CurrencyCode, 'narrow');
    if (!this.isPeerComphubType) {
      this.loadJobTrendChart();
    } else {
      this.filterContext$ = this.exchangeExplorerContextService.selectFilterContext();
      this.filterContextSubscription = this.filterContext$.subscribe(fc => {
        this.filterContext = fc;
        this.filterContextHasFilters = fc.Filters.filter(x => x.Options.length > 0).length > 0;
      });
    }
  }
}
