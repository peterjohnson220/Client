import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';

import { ExchangeRequestTypeEnum, Exchange, AsyncStateObj } from 'libs/models';
import * as fromCompanyContextActions from 'libs/state/app-context/actions/company-context.actions';
import { Permissions } from 'libs/constants';
import { Workbook } from 'libs/features/surveys/reports/models';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { SettingsService } from 'libs/state/app-context/services';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common';
import { CompanySettingsEnum } from 'libs/models/company';

import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromUploadOrgDataAction from '../../../actions/upload-org-data.actions';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';
import { PeerTrendReportModalComponent } from '../../../components/peer-trend-report-modal';

@Component({
  selector: 'pf-exchange-dashboard-page',
  templateUrl: './exchange-dashboard.page.html',
  styleUrls: ['./exchange-dashboard.page.scss']
})
export class ExchangeDashboardPageComponent implements OnInit, OnDestroy {
  @ViewChild(PeerTrendReportModalComponent) peerTrendReportModal: PeerTrendReportModalComponent;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;

  sidebarVisible$: Observable<boolean>;
  mapHasData$: Observable<boolean>;
  mapHasDataError$: Observable<boolean>;
  uploadOrgDataModalOpen$: Observable<boolean>;
  exchange$: Observable<Exchange>;
  peerTrendsReportWorkbookAsync$: Observable<AsyncStateObj<Workbook>>;
  unsubscribe$ = new Subject<void>();
  enableFileDownloadSecurityWarning$: Observable<boolean>;

  exchangeSubscription: Subscription;
  enableFileDownloadSecurityWarningSubscription: Subscription;

  permissions = Permissions;
  exchangeId: number;
  isSystemExchange = false;
  peerTrendsReportFeatureFlag: RealTimeFlag = { key: FeatureFlags.PeerDashboard_PeerTrendsReport, value: false };
  enableFileDownloadSecurityWarning = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>,
    private featureFlagService: AbstractFeatureFlagService,
    private settingsService: SettingsService
  ) {
    this.sidebarVisible$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardSidebarVisible));
    this.mapHasData$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardMapHasData));
    this.mapHasDataError$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardMapHasDataError));
    this.exchange$ = this.store.pipe(select(fromSharedPeerReducer.getExchange));
    this.uploadOrgDataModalOpen$ = this.store.pipe(select(fromPeerDashboardReducer.getUploadOrgDataModalOpen));
    this.enableFileDownloadSecurityWarning$ = this.settingsService.selectCompanySetting<boolean>(CompanySettingsEnum.FileDownloadSecurityWarning);
    this.peerTrendsReportWorkbookAsync$ = this.store.pipe(select(fromPeerDashboardReducer.getPeerTrendsReportWorkbook));
    this.featureFlagService.bindEnabled(this.peerTrendsReportFeatureFlag, this.unsubscribe$);
  }

  get peerTrendsReportEnabled(): boolean {
    return this.isSystemExchange && !!this.peerTrendsReportFeatureFlag.value;
  }

  manageJobsClick(): void {
    this.router.navigate(['manage'], { relativeTo: this.route.parent.parent });
  }

  referCompanyClick(): void {
    this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.ReferPayfactorsCompany));
  }

  mapClick(): void {
    this.router.navigate(['map'], { relativeTo: this.route.parent.parent });
  }

  handlePeerTrendsReportClick(): void {
    this.peerTrendReportModal.open();
  }

  getTitle(hasData: boolean, hasDataError: boolean): string {
    if (hasDataError) { return 'Failed to get map data'; }
    if (!hasData) { return 'No exchange map data available'; }
    return '';
  }

  openUploadOrgDataModal() {
    this.store.dispatch(new fromUploadOrgDataAction.OpenUploadOrgDataModal());
  }

  closeUploadOrgDataModal() {
    this.store.dispatch(new fromUploadOrgDataAction.CloseUploadOrgDataModal());
  }

  handleUploadOrgData(uploadData: any) {
    this.store.dispatch(new fromUploadOrgDataAction.UploadFile(uploadData));
  }

  handleSecurityWarningConfirmed(isConfirmed) {
    if (isConfirmed) {
      this.exportExchangeJobs();
    }
  }

  handleExportExchangeJobs(): void {
    if (this.enableFileDownloadSecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportExchangeJobs();
    }
  }

  exportExchangeJobs(): void {
    this.store.dispatch(new fromExchangeDashboardActions.ExportExchangeJobs({exchangeId: this.exchangeId}));
  }

  // Lifecycle
  ngOnInit() {
    this.store.dispatch(new fromCompanyContextActions.GetCompanyContext());

    this.store.dispatch(new fromExchangeDashboardActions.CloseSidebar());

    this.exchangeSubscription = this.exchange$.subscribe(ex => {
        this.store.dispatch(new fromExchangeDashboardActions.LoadMapCount(ex.ExchangeId));
        this.exchangeId = ex.ExchangeId;
        this.isSystemExchange = ex.IsSystemExchange;
    });

    this.enableFileDownloadSecurityWarningSubscription = this.enableFileDownloadSecurityWarning$.subscribe(isEnabled => {
      if (isEnabled) {
        this.enableFileDownloadSecurityWarning = true;
      }
    });
  }

  ngOnDestroy() {
    this.exchangeSubscription.unsubscribe();
    this.enableFileDownloadSecurityWarningSubscription.unsubscribe();
    this.unsubscribe$.next();
  }
}
