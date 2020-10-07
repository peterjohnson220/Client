import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { CompanySettingsEnum, FeatureAreaConstants, KendoDropDownItem, UiPersistenceSettingConstants } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';
import { ExchangeExplorerComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer';
import { Weights, WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';
import { DojGuidelinesService } from 'libs/features/peer/guidelines-badge/services/doj-guidelines.service';
import { ExchangeExplorerMapComponent } from 'libs/features/peer/exchange-explorer/containers/exchange-explorer-map';
import * as fromLibsPeerExchangeExplorerReducers from 'libs/features/peer/exchange-explorer/reducers';
import * as fromLibsExchangeExplorerFilterContextActions from 'libs/features/peer/exchange-explorer/actions/exchange-filter-context.actions';
import * as fromDataCutValidationActions from 'libs/features/peer/actions/data-cut-validation.actions';
import * as fromDataCutValidationReducer from 'libs/features/peer/guidelines-badge/reducers';

import * as fromUpsertDataCutActions from '../../actions/upsert-peer-data-cut.actions';
import * as fromRequestPeerAccessActions from '../../actions/request-peer-access.actions';
import * as fromUpsertPeerDataReducers from '../../reducers';

@Component({
  selector: 'pf-upsert-peer-data-cut',
  templateUrl: './upsert-peer-data-cut.component.html',
  styleUrls: ['./upsert-peer-data-cut.component.scss']
})
export class UpsertPeerDataCutComponent implements OnInit, OnDestroy {
  @Input() companyJobId: number;
  @Input() companyPayMarketId: number;
  @Input() userSessionId: number;
  @Input() isPayMarketOverride: boolean;
  @Input() cutGuid: string;
  @Input() userJobMatchId: number;
  @Input() displayInClassicAspIframe: boolean;
  @ViewChild(ExchangeExplorerMapComponent, {static: true}) map: ExchangeExplorerMapComponent;
  @ViewChild(ExchangeExplorerComponent, {static: true}) exchangeExplorer: ExchangeExplorerComponent;

  upsertDataCutPageInViewInIframe$: Observable<boolean>;
  peerMapCompanies$: Observable<any>;
  employeesValid$: Observable<boolean>;
  upsertingDataCut$: Observable<boolean>;
  upsertingDataCutError$: Observable<boolean>;
  includeUntaggedIncumbents$: Observable<boolean>;
  untaggedIncumbentCount$: Observable<number>;
  requestingPeerAccess$: Observable<boolean>;
  hasAcceptedPeerTerms$: Observable<boolean>;
  hasRequestedPeerAccess$: Observable<boolean>;
  isEmployeeCheckLoading$: Observable<boolean>;
  weightingType$: Observable<string>;
  persistedWeightingTypeForDataCuts$: Observable<string>;

  untaggedIncumbentCount: number;

  // Subscriptions
  peerMapCompaniesSubscription: Subscription;
  weightingTypeSubscription: Subscription;
  persistedWeightingTypeForDataCutsSubscription: Subscription;
  untaggedIncumbentCountSubscription: Subscription;

  requestPeerAccessMessage = `Thank you for your interest in Peer. Peer allows you to market price with unmatched
  granularity and specificity right from within the Payfactors suite. Simply click "Request Access" and someone
  will reach out to get you started with Peer.`;
  accessRequestedMessage = `Thank you for requesting access to Peer. A Payfactors representative will be in
  touch shortly to discuss the details of Peer and how you can become an active member of Peer.`;
  selectedWeightingType: KendoDropDownItem = { Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc };


  constructor(
    private store: Store<fromUpsertPeerDataReducers.State>,
    private mapStore: Store<fromLibsPeerExchangeExplorerReducers.State>,
    private guidelinesService: DojGuidelinesService,
    private settingsService: SettingsService
  ) {
    this.upsertingDataCut$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCut));
    this.upsertingDataCutError$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCutError));
    this.upsertDataCutPageInViewInIframe$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutInIframe));
    this.requestingPeerAccess$ = this.store.pipe(select(fromUpsertPeerDataReducers.getRequestingPeerAccess));
    this.employeesValid$ = this.store.pipe(select(fromDataCutValidationReducer.getEmployeeCheckPassed));
    this.isEmployeeCheckLoading$ = this.store.pipe(select(fromDataCutValidationReducer.getIsEmployeeSimilarityLoading));

    this.peerMapCompanies$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapCompaniesFromSummary));
    this.includeUntaggedIncumbents$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getFilterContextIncludeUntaggedIncumbents));
    this.untaggedIncumbentCount$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getPeerMapUntaggedIncumbentCount));
    this.weightingType$ = this.store.pipe(select(fromLibsPeerExchangeExplorerReducers.getWeightingType));

    this.hasRequestedPeerAccess$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.Project, UiPersistenceSettingConstants.PeerAccessRequested
    );
    this.hasAcceptedPeerTerms$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.PeerTermsAndConditionsAccepted
    );
    this.persistedWeightingTypeForDataCuts$ = this.settingsService.selectUiPersistenceSetting(
      FeatureAreaConstants.PeerDataCuts,
      UiPersistenceSettingConstants.PeerAddDataModalWeightingTypeSelection,
      'string'
    );
  }

  get primaryButtonText(): string {
    return this.cutGuid != null ? 'Update' : 'Add';
  }

  get failsGuidelines(): boolean {
    return !this.guidelinesService.passesGuidelines;
  }

  handleUntaggedIncumbentsChecked(): void {
    this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions.ToggleIncludeUntaggedEmployees);
  }

  handleWeightingTypeChanged(item: KendoDropDownItem) {
    this.selectedWeightingType = item;
    this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions.SetWeightingType({ weightingType: item.Value }));
    if (this.cutGuid === null) {
      this.store.dispatch(new fromUpsertDataCutActions.SelectWeightingType({newWeightingType: item.Value}));
    }
  }

  upsert() {
    this.store.dispatch(new fromUpsertDataCutActions.UpsertDataCut({
      DataCutGuid: this.cutGuid,
      CompanyJobId: this.companyJobId,
      CompanyPayMarketId: this.companyPayMarketId,
      IsPayMarketOverride: this.isPayMarketOverride,
      UserSessionId: this.userSessionId,
      UserJobMatchId: this.userJobMatchId,
      ZoomLevel: this.map ? this.map.getZoomLevel() : 0
    }));
  }

  requestPeerAccess(): void {
    this.store.dispatch(new fromRequestPeerAccessActions.RequestPeerAccess);
  }

  cancel() {
    this.store.dispatch(new fromUpsertDataCutActions.CancelUpsertDataCut);
  }

  // Lifecycle events
  ngOnInit(): void {
    this.setSubscriptions();

    if (this.displayInClassicAspIframe) {
      const setContextMessage: MessageEvent = {
        data: {
          payfactorsMessage: {
            type: 'Set Context',
            payload: {
              companyJobId: this.companyJobId,
              companyPayMarketId: this.companyPayMarketId,
              userSessionId: this.userSessionId,
              isPayMarketOverride: this.isPayMarketOverride,
              cutGuid: this.cutGuid,
              isExchangeSpecific: false
            }
          }
        }
      } as MessageEvent;
      this.exchangeExplorer.onMessage(setContextMessage);
    }

    this.store.dispatch(new fromDataCutValidationActions.LoadDataCutValidation(
      {
        CompanyJobId: this.companyJobId,
        UserSessionId: this.userSessionId
      }
    ));
  }

  ngOnDestroy() {
    this.peerMapCompaniesSubscription.unsubscribe();
    this.weightingTypeSubscription.unsubscribe();
    this.persistedWeightingTypeForDataCutsSubscription.unsubscribe();
  }



  setSubscriptions(): void {
    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pms => {
      this.guidelinesService.validateDataCut(pms, this.companyJobId, this.userSessionId);
    });
    this.weightingTypeSubscription = this.weightingType$.subscribe(wts => {
      if (this.cutGuid !== null) {
        this.selectedWeightingType = Weights.find(w => w.Value === wts);
      }
    });
    this.persistedWeightingTypeForDataCutsSubscription = this.persistedWeightingTypeForDataCuts$.subscribe(weightingType => {
      if (!!weightingType && this.cutGuid === null) {
        this.selectedWeightingType = Weights.find(w => w.Value === weightingType);
        this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions
          .SetWeightingType({ weightingType: this.selectedWeightingType.Value }));
      }
    });

    this.untaggedIncumbentCountSubscription = this.untaggedIncumbentCount$.subscribe( untaggedIncumbentCount => {
      this.untaggedIncumbentCount = untaggedIncumbentCount;
    });
  }

  get untaggedIncumbentMessage(): string {
    if (this.untaggedIncumbentCount === 1) {
      return `Include ${this.untaggedIncumbentCount} incumbent that does not have location data`;
    }
    return `Include ${this.untaggedIncumbentCount} incumbents that do not have location data`;
  }
}
