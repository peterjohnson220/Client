import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ExchangeRequestTypeEnum, Exchange } from 'libs/models';
import * as fromCompanyContextActions from 'libs/state/app-context/actions/company-context.actions';
import { Permissions } from 'libs/constants';

import * as fromExchangeDashboardActions from '../../../actions/exchange-dashboard.actions';
import * as fromUploadOrgDataAction from '../../../actions/upload-org-data.actions';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromPeerDashboardReducer from '../../../reducers';
import * as fromSharedPeerReducer from '../../../../shared/reducers';

@Component({
  selector: 'pf-exchange-dashboard-page',
  templateUrl: './exchange-dashboard.page.html',
  styleUrls: ['./exchange-dashboard.page.scss']
})
export class ExchangeDashboardPageComponent implements OnInit, OnDestroy {
  sidebarVisible$: Observable<boolean>;
  mapHasData$: Observable<boolean>;
  mapHasDataError$: Observable<boolean>;
  uploadOrgDataModalOpen$: Observable<boolean>;
  exchange$: Observable<Exchange>;
  exchangeSubscription: Subscription;
  permissions = Permissions;
  exchangeId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromPeerDashboardReducer.State>
  ) {
    this.sidebarVisible$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardSidebarVisible));
    this.mapHasData$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardMapHasData));
    this.mapHasDataError$ = this.store.pipe(select(fromPeerDashboardReducer.getExchangeDashboardMapHasDataError));
    this.exchange$ = this.store.pipe(select(fromSharedPeerReducer.getExchange));
    this.uploadOrgDataModalOpen$ = this.store.pipe(select(fromPeerDashboardReducer.getUploadOrgDataModalOpen));
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
    });
  }

  ngOnDestroy() {
    this.exchangeSubscription.unsubscribe();
  }
}
