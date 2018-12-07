import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import { SystemFilter } from 'libs/models/peer';
import { MapComponent } from 'libs/features/peer/map/containers/map';

import * as fromUpsertDataCutPageActions from '../../../actions/upsert-data-cut-page.actions';
import * as fromDataCutValidationActions from '../../../actions/data-cut-validation.actions';
import * as fromUpsertPeerDataReducers from '../../../reducers';
import { DojGuidelinesService } from '../../../services/doj-guidelines.service';

@Component({
  selector: 'pf-upsert-data-cut-page',
  templateUrl: './upsert-data-cut.page.html',
  styleUrls: ['./upsert-data-cut.page.scss']
})
export class UpsertDataCutPageComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) map: MapComponent;

  upsertDataCutPageInViewInIframe$: Observable<boolean>;
  peerMapCompanies$: Observable<any>;
  upsertingDataCut$: Observable<boolean>;
  upsertingDataCutError$: Observable<boolean>;
  initialMapMoveComplete$: Observable<boolean>;
  includeUntaggedIncumbents$: Observable<boolean>;
  untaggedIncumbentCount$: Observable<number>;
  systemFilter$: Observable<SystemFilter>;

  // Subscriptions
  peerMapCompaniesSubscription: Subscription;

  companyJobId: number;
  companyPayMarketId: number;
  userSessionId: number;
  isPayMarketOverride: boolean;
  cutGuid: string;

  constructor(
    private store: Store<fromUpsertPeerDataReducers.State>,
    private mapStore: Store<fromPeerMapReducers.State>,
    private route: ActivatedRoute,
    private guidelinesService: DojGuidelinesService
  ) {
    this.upsertingDataCut$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCut));
    this.upsertingDataCutError$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCutError));
    this.initialMapMoveComplete$ = this.mapStore.pipe(select(fromPeerMapReducers.getPeerMapInitialMapMoveComplete));
    this.systemFilter$ = this.store.pipe(select(fromPeerMapReducers.getSystemFilter));
    this.upsertDataCutPageInViewInIframe$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutPageInViewInIframe));
    this.peerMapCompanies$ = this.store.pipe(select(fromPeerMapReducers.getPeerMapCompaniesFromSummary));
    this.includeUntaggedIncumbents$ = this.store.pipe(select(fromPeerMapReducers.getPeerFilterIncludeUntaggedIncumbents));
    this.untaggedIncumbentCount$ = this.store.pipe(select(fromPeerMapReducers.getPeerFilterCountUnGeoTaggedIncumbents));
  }

  get primaryButtonText(): string {
    return this.cutGuid != null ? 'Update' : 'Add';
  }

  get failsGuidelines(): boolean {
    return !this.guidelinesService.passesGuidelines;
  }

  handleUntaggedIncumbentsChecked(): void {
    this.store.dispatch(new fromFilterSidebarActions.ToggleIncludeUntaggedEmployees);
  }

  upsert() {
    this.store.dispatch(new fromUpsertDataCutPageActions.UpsertDataCut({
      DataCutGuid: this.cutGuid,
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId,
      IsPayMarketOverride: this.isPayMarketOverride,
      UserSessionId: this.userSessionId,
      ZoomLevel: this.map ? this.map.getZoomLevel() : 0
    }));
  }

  cancel() {
    this.store.dispatch(new fromUpsertDataCutPageActions.CancelUpsertDataCut);
  }

  // Lifecycle events
  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyJobId = +queryParamMap.get('companyJobId') || 0;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    this.userSessionId = +queryParamMap.get('userSessionId') || 0;
    this.isPayMarketOverride = queryParamMap.get('isPayMarketOverride') === 'true';
    this.cutGuid = queryParamMap.get('dataCutGuid') || null;

    if (this.cutGuid == null) {
      this.store.dispatch(new fromFilterSidebarActions.LoadSystemFilter({
        CompanyJobId: this.companyJobId,
        CompanyPayMarketId: this.companyPayMarketId
      }));
    } else {
      this.store.dispatch(new fromUpsertDataCutPageActions.LoadDataCutDetails(this.cutGuid));
    }

    this.store.dispatch(new fromDataCutValidationActions.LoadDataCutValidation(
      {
        CompanyJobId: this.companyJobId,
        UserSessionId: this.userSessionId
      }
    ));

    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pms => {
      // If the cutGuid is null, we can assume that we are NOT editing a data cut and we therefor need to check similarity.
      const shouldCheckSimilarity = this.cutGuid === null;
      this.guidelinesService.validateDataCut(pms, shouldCheckSimilarity);
    });
  }

  ngOnDestroy() {
    this.peerMapCompaniesSubscription.unsubscribe();
  }

  // Add Data cut page within marketdata.asp specific code
  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    if (this.inIframe() && ev.data === 'peer-exchange-tab-clicked') {
      // Hack. Wait a little before telling the client app that page is now in view in
      // an IFrame. Need to do this to allow the css positioning of the map to finish on the ASP side
      // before passing off the bounds to the map to initialize zooming. Otherwise we will run into the "Zoom Bug"
      // where the map does not zoom all the way in.
      window.setTimeout(() => {
        this.store.dispatch(new fromUpsertDataCutPageActions.PageInViewInIframe());
      }, 100);
    }
  }

  inIframe () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}
