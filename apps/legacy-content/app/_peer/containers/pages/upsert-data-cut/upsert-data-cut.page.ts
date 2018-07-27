import { Component, OnInit, HostListener, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromPeerMapReducers from 'libs/features/peer/map/reducers';
import * as fromFilterSidebarActions from 'libs/features/peer/map/actions/filter-sidebar.actions';
import { SystemFilter, ExchangeMapSummary, DataCutValidationInfo } from 'libs/models/peer';
import { MapComponent } from 'libs/features/peer/map/containers/map';

import * as fromUpsertDataCutPageActions from '../../../actions/upsert-data-cut-page.actions';
import * as fromDataCutValidationActions from '../../../actions/data-cut-validation.actions';
import * as fromUpsertPeerDataReducers from '../../../reducers';
import { GuidelineLimits } from '../../../models';

@Component({
  selector: 'pf-upsert-data-cut-page',
  templateUrl: './upsert-data-cut.page.html',
  styleUrls: ['./upsert-data-cut.page.scss']
})
export class UpsertDataCutPageComponent implements OnInit, OnDestroy {
  @ViewChild(MapComponent) map: MapComponent;
  companyJobId: number;
  companyPayMarketId: number;
  userSessionId: number;
  cutGuid: string;
  peerFilterSelections: any;
  validDataCut = true;
  previousSelections: number[] = [];
  dataCutValidationInfo: DataCutValidationInfo[];

  // Subscriptions
  dataCutValidationSubscription: Subscription;
  peerFilterSubscription: Subscription;

  readonly guidelineLimits: GuidelineLimits = { MinCompanies: 5, DominatingPercentage: .25 };

  upsertingDataCut$: Observable<boolean>;
  upsertingDataCutError$: Observable<boolean>;
  peerMapSummary$: Observable<ExchangeMapSummary>;
  initialMapMoveComplete$: Observable<boolean>;
  systemFilter$: Observable<SystemFilter>;
  upsertDataCutPageInViewInIframe$: Observable<boolean>;
  dataCutValidationInfo$: Observable<DataCutValidationInfo[]>;
  peerFilterSelections$: Observable<any>;

  constructor(
    private store: Store<fromUpsertPeerDataReducers.State>,
    private mapStore: Store<fromPeerMapReducers.State>,
    private route: ActivatedRoute
  ) {
    this.upsertingDataCut$ = this.store.select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCut);
    this.upsertingDataCutError$ = this.store.select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCutError);
    this.peerMapSummary$ = this.mapStore.select(fromPeerMapReducers.getPeerMapSummary);
    this.initialMapMoveComplete$ = this.mapStore.select(fromPeerMapReducers.getPeerMapInitialMapMoveComplete);
    this.systemFilter$ = this.store.select(fromPeerMapReducers.getSystemFilter);
    this.upsertDataCutPageInViewInIframe$ = this.store.select(fromUpsertPeerDataReducers.getUpsertDataCutPageInViewInIframe);
    this.dataCutValidationInfo$ = this.store.select(fromUpsertPeerDataReducers.getDataCutValidationInfo);
    this.peerFilterSelections$ = this.store.select(fromPeerMapReducers.getPeerFilterSelections);
  }

  static checkEqualArrays(arr1, arr2) {
    return (JSON.stringify(arr1) === JSON.stringify(arr2));
  }

  get primaryButtonText(): string {
    return this.cutGuid != null ? 'Update' : 'Add';
  }

  upsert() {
    this.store.dispatch(new fromUpsertDataCutPageActions.UpsertDataCut({
      DataCutGuid: this.cutGuid,
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId,
      UserSessionId: this.userSessionId,
      ZoomLevel: this.map ? this.map.getZoomLevel() : 0
    }));
  }

  cancel() {
    this.store.dispatch(new fromUpsertDataCutPageActions.CancelUpsertDataCut);
  }

  validateDataCut() {
    const selections = this.peerFilterSelections;
    const validationInfo = this.dataCutValidationInfo;
    let validationPass = true;

    // If there are no company filters selected then we don't care and the validation passes.
    if (selections.CompanyIds) {
      const selectedCompanies: number[] = selections.CompanyIds;
      // If there are less than 5 company's selected or if the validationInfo array does not have any values the validation passes.
      if (selectedCompanies.length > 4 && validationInfo.length > 0) {
        // In an attempt to make this method faster, a previousSelections variable will be stored.
        // Current selections and previousSelections will be checked, if they are equal then we do not change the validation variable.
        if (!UpsertDataCutPageComponent.checkEqualArrays(selectedCompanies, this.previousSelections)) {
          this.previousSelections = selectedCompanies;
          // Check against each existing cut, if it fails we break out and set validation to false.
          for (const value of validationInfo) {
            if (this.checkArraysOneOff(selectedCompanies, value.CompanyIds)) {
              validationPass = false;
              break;
            }
          }
        } else {
          return;
        }
      }
    }

    this.validDataCut = validationPass;
  }

  checkArraysOneOff(selectedCompanies, validateCutCompanies) {
    const selectedCompaniesOneMore = selectedCompanies.length === validateCutCompanies.length + 1;
    // If the counts are not off by one (in either direction) then we do not need to check the contents of the lists.
    if (!selectedCompaniesOneMore && !(selectedCompanies.length === validateCutCompanies.length - 1)) {
      return false;
    }
    // If the selected companies array is larger we then want to check and
    // see if every data cut company is in the selected companies array.
    // If so, then the validation fails because we know that the selected companies array is only one larger than the data cut array.
    if (selectedCompaniesOneMore) {
      return (validateCutCompanies.every(val => selectedCompanies.includes(val)));
      // If the data cut companies array is larger we then want to check and see if every selected company is in the data cut array.
      // If so, then the validation fails because we know that the selected companies array is only one smaller than the data cut array.
    } else {
      return (selectedCompanies.every(val => validateCutCompanies.includes(val)));
    }
  }

  // Lifecycle events
  ngOnInit(): void {
    const queryParamMap = this.route.snapshot.queryParamMap;
    this.companyJobId = +queryParamMap.get('companyJobId') || 0;
    this.companyPayMarketId = +queryParamMap.get('companyPayMarketId') || 0;
    this.userSessionId = +queryParamMap.get('userSessionId') || 0;
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

    this.dataCutValidationSubscription = this.dataCutValidationInfo$.subscribe(dcvi => this.dataCutValidationInfo = dcvi);
    this.peerFilterSubscription = this.peerFilterSelections$.subscribe(pfs => {
      this.peerFilterSelections = pfs;
      // If the cutGuid is null, we can assume that we are not editing a data cut and we therefor need to validate.
      if (this.cutGuid == null) {
        this.validateDataCut();
      }
    });
  }

  ngOnDestroy() {
    this.dataCutValidationSubscription.unsubscribe();
    this.peerFilterSubscription.unsubscribe();
  }

  // Add Data cut page within marketdata.asp specific code
  @HostListener('window:message', ['$event'])
  onMessage(ev) {
    if (this.inIframe() && ev.data === 'peer-exchange-tab-clicked') {
      // Hack. Wait a little before telling the client app that page is now in view in
      // an IFrame. Need to do this to allow the css positioning of the map to finish on the ASP side
      // before passing off the bounds to the map to initialize zooming. Otherwise we will run into the "Zoom Bug"
      // where the map does not zoom all the way in.
      setTimeout(() => {
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
