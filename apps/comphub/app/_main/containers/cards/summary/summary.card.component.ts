import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { CurrencyPipe, getCurrencySymbol } from '@angular/common';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { pdf } from '@progress/kendo-drawing';
const { exportPDF } = pdf;
import isEqual from 'lodash/isEqual';

import { SearchFilterOption, SharePricingSummaryRequest } from 'libs/models/payfactors-api';
import * as fromRootReducer from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { QuickPriceType, SystemUserGroupNames } from 'libs/constants';
import { RateType, Rates, WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { KendoDropDownItem } from 'libs/models/kendo';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeMapSummary } from 'libs/models/peer';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';

import * as fromSummaryCardActions from '../../../actions/summary-card.actions';
import * as fromDataCardActions from '../../../actions/data-card.actions';
import * as fromComphubMainReducer from '../../../reducers';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import { JobData, PricingPaymarket, JobSalaryTrend, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';
import { DataCardHelper } from '../../../helpers';
@Component({
  selector: 'pf-summary-card',
  templateUrl: './summary.card.component.html',
  styleUrls: ['./summary.card.component.scss']
})
export class SummaryCardComponent implements OnInit, OnDestroy {
  @Input() pageId = ComphubPages.Summary;

  @ViewChild('pdf', { static: true }) pdf: PDFExportComponent;

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
  filterContext$: Observable<any>;
  workflowContext$: Observable<WorkflowContext>;
  mapSummary$: Observable<ExchangeMapSummary>;
  calculatingJobData$: Observable<boolean>;
  showJobsHistorySummary$: Observable<boolean>;

  selectedJobDataSubscription: Subscription;
  selectedPaymarketSubscription: Subscription;
  selectedRateSubscription: Subscription;
  salaryTrendSubscription: Subscription;
  filterContextSubscription: Subscription;
  workflowContextSubscription: Subscription;
  showJobHistorySummarySubscription: Subscription;
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
  isPeerQuickPriceType = false;
  filterContextHasFilters = false;
  rates: KendoDropDownItem[] = Rates;
  showJobHistorySummary: boolean;
  currencyCode: string;

  private mbAccessToken: string;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeExplorerStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    public cp: CurrencyPipe
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
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.mapSummary$ = this.exchangeExplorerStore.select(fromLibsPeerExchangeExplorerReducers.getPeerMapSummary);
    this.calculatingJobData$ = this.store.select(fromComphubMainReducer.getRecalculatingJobData);
    this.showJobsHistorySummary$ = this.store.select(fromComphubMainReducer.getShowJobPricedHistorySummary);
  }

  ngOnInit() {
    this.selectedJobDataSubscription = this.selectedJobData$.subscribe(data => this.jobData = data);
    this.selectedPaymarketSubscription = this.selectedPaymarket$.subscribe(paymarket => this.paymarket = paymarket);
    this.selectedRateSubscription = this.selectedRate$.subscribe(r => this.selectedRate = r);
    this.showJobHistorySummarySubscription = this.showJobsHistorySummary$.subscribe(x => this.showJobHistorySummary = x);
    this.salaryTrendSubscription = this.salaryTrendData$.subscribe(trendData => {
      this.jobSalaryTrendData = cloneDeep(trendData);
    });
    this.workflowContextSubscription = this.workflowContext$.subscribe(wfc => {
      if (!!wfc && wfc.selectedPageId === ComphubPages.Summary) {
        this.workflowContext = wfc;
        this.isPeerQuickPriceType = wfc.quickPriceType === QuickPriceType.PEER;
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
  }

  ngOnDestroy() {
    this.selectedJobDataSubscription.unsubscribe();
    this.selectedPaymarketSubscription.unsubscribe();
    this.selectedRateSubscription.unsubscribe();
    this.showJobHistorySummarySubscription.unsubscribe();
    this.salaryTrendSubscription.unsubscribe();
    if (this.isPeerQuickPriceType && this.filterContextSubscription) {
      this.filterContextSubscription.unsubscribe();
    }
    this.workflowContextSubscription.unsubscribe();
    this.userContextSubscription.unsubscribe();
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
    if (this.isPeerQuickPriceType) {
      this.store.dispatch(new fromSummaryCardActions.PriceNewPeerJob());
    } else {
      this.store.dispatch(new fromSummaryCardActions.PriceNewJob());
    }
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
    const style = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/';
    const htmlEncodedHashTag = '%23';
    const geoJson = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: this.calculatePolygonCoordinates()
      },
      properties: {
        stroke: htmlEncodedHashTag + '3f8845',
        fill: htmlEncodedHashTag + '3f8845',
        'fill-opacity': 0.1
      }
    };
    return style + 'geojson(' + JSON.stringify(geoJson) + ')/auto/600x600?access_token=' + this.mbAccessToken;
  }

  calculatePolygonCoordinates() {
    // Default to the largest coordinates the map can expand to.
    let polygonCoordinates = [[[-180, 90], [-180, -90], [180, -90], [180, 90], [-180, 90]]];
    if (!!this.filterContext && !!this.filterContext.FilterContext
      && !!this.filterContext.FilterContext.TopLeft && !!this.filterContext.FilterContext.BottomRight) {
      const topLeft = this.filterContext.FilterContext.TopLeft;
      const bottomRight = this.filterContext.FilterContext.BottomRight;

      polygonCoordinates = [[[topLeft.Lon, topLeft.Lat],
        [topLeft.Lon, bottomRight.Lat],
        [bottomRight.Lon, bottomRight.Lat],
        [bottomRight.Lon, topLeft.Lat],
        [topLeft.Lon, topLeft.Lat]]];
    }

    return polygonCoordinates;
  }

  getFilterString(options: SearchFilterOption[]): string {
    let optionsStr = '';
    for (const option of options) {
      optionsStr += option.Name + ', ';
    }
    return optionsStr.replace(/,\s*$/, '');
  }

  onWorkflowContextChanges(): void {
    if (!this.isPeerQuickPriceType) {
      if (this.paymarketHasChanged() || this.jobHasChanged()) {
        this.store.dispatch(new fromSummaryCardActions.RecalculateJobData());
        if (this.jobHasChanged()) {
          this.loadJobTrendChart();
        }
      }
      this.lastPaymarket = this.paymarket;
      this.lastJobData = this.jobData;
      this.currencyCode = this.workflowContext.activeCountryDataSet.CurrencyCode;
      this.currencySymbol = getCurrencySymbol(this.workflowContext.activeCountryDataSet.CurrencyCode, 'narrow');
    } else if (this.isPeerQuickPriceType) {
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
    this.currencySymbol = getCurrencySymbol(this.paymarket.CurrencyCode, 'narrow');
    if (!this.isPeerQuickPriceType) {
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
