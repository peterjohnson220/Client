import {
  ChangeDetectorRef,
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,
} from '@angular/core';

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
import * as fromExchangeExplorerActions from 'libs/features/peer/exchange-explorer/actions/exchange-explorer.actions';
import { TempExchangeDataCutDetails } from 'libs/models/payfactors-api/peer/exchange-data-search/request';

import * as fromUpsertDataCutActions from '../actions/upsert-peer-data-cut.actions';
import * as fromRequestPeerAccessActions from '../actions/request-peer-access.actions';
import * as fromUpsertPeerDataReducers from '../reducers';
import { UpsertPeerDataCutEntityConfigurationModel } from '../models';

@Component({
  selector: 'pf-upsert-peer-data-cut',
  templateUrl: './upsert-peer-data-cut.component.html',
  styleUrls: ['./upsert-peer-data-cut.component.scss']
})
export class UpsertPeerDataCutComponent implements OnInit, OnDestroy, OnChanges {
  @Input() companyJobId: number;
  @Input() companyPayMarketId: number;
  @Input() isPayMarketOverride: boolean;
  @Input() cutGuid: string;
  @Input() displayInClassicAspIframe: boolean;
  @Input() entityConfiguration: UpsertPeerDataCutEntityConfigurationModel;
  @Output() cancelChanges = new EventEmitter();
  @Output() refinedDataCutDetails = new EventEmitter<TempExchangeDataCutDetails>();

  @ViewChild(ExchangeExplorerMapComponent, {static: true}) map: ExchangeExplorerMapComponent;
  @ViewChild(ExchangeExplorerComponent) exchangeExplorer: ExchangeExplorerComponent;

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
  loadedDataCutDetails$: Observable<TempExchangeDataCutDetails>;

  untaggedIncumbentCount: number;
  displayMap = false;
  refining: boolean;

  // Subscriptions
  peerMapCompaniesSubscription: Subscription;
  weightingTypeSubscription: Subscription;
  persistedWeightingTypeForDataCutsSubscription: Subscription;
  untaggedIncumbentCountSubscription: Subscription;
  loadedDataCutDetailsSubscription: Subscription;

  requestPeerAccessMessage = `Thank you for your interest in Peer. Peer allows you to market price with unmatched
  granularity and specificity right from within the Payfactors suite. Simply click "Request Access" and someone
  will reach out to get you started with Peer.`;
  accessRequestedMessage = `Thank you for requesting access to Peer. A Payfactors representative will be in
  touch shortly to discuss the details of Peer and how you can become an active member of Peer.`;
  selectedWeightingType: KendoDropDownItem = { Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc };


  constructor(
    private store: Store<fromUpsertPeerDataReducers.State>,
    private guidelinesService: DojGuidelinesService,
    private settingsService: SettingsService,
    private cdRef: ChangeDetectorRef
  ) {
    this.upsertingDataCut$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCut));
    this.upsertingDataCutError$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutAddingDataCutError));
    this.upsertDataCutPageInViewInIframe$ = this.store.pipe(select(fromUpsertPeerDataReducers.getUpsertDataCutInIframe));
    this.requestingPeerAccess$ = this.store.pipe(select(fromUpsertPeerDataReducers.getRequestingPeerAccess));
    this.loadedDataCutDetails$ = this.store.select(fromUpsertPeerDataReducers.getLoadedDataCutDetails);
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
    if (this.displayMap) {
      if (!this.refining) {
        this.store.dispatch(new fromUpsertDataCutActions.UpsertDataCut({
          DataCutGuid: this.cutGuid,
          CompanyJobId: this.companyJobId,
          CompanyPayMarketId: this.companyPayMarketId,
          IsPayMarketOverride: this.isPayMarketOverride,
          EntityConfiguration: this.entityConfiguration,
          ZoomLevel: this.map ? this.map.getZoomLevel() : 0,
          BaseEntityId: this.entityConfiguration.BaseEntityId
        }));
        this.reset();
      } else {
        this.store.dispatch(new fromUpsertDataCutActions.GetRefinedExchangeDataCutDetails());
      }
    }
  }

  requestPeerAccess(): void {
    this.store.dispatch(new fromRequestPeerAccessActions.RequestPeerAccess);
  }

  cancel(sendEmit = true) {
    this.exchangeExplorer.onResetApp();
    this.store.dispatch(new fromUpsertDataCutActions.CancelUpsertDataCut);
    this.reset();

    if (sendEmit) {
      this.cancelChanges.emit();
    }
  }

  reset(): void {
    this.displayMap = false;
    this.refining = false;
    this.store.dispatch(new fromExchangeExplorerActions.ResetExchangeExplorerState());
    this.guidelinesService.clearMapCompanies();
  }

  // Lifecycle events

  ngOnInit(): void {
    this.setSubscriptions();
    if (this.displayInClassicAspIframe) {
      this.showMap();
      const contextData = {
        companyJobId: this.companyJobId,
        companyPayMarketId: this.companyPayMarketId,
        userSessionId: this.entityConfiguration.ParentEntityId,
        isPayMarketOverride: this.isPayMarketOverride,
        cutGuid: this.cutGuid,
        isExchangeSpecific: false
      };

      this.setContext(contextData);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entityConfiguration'] && changes['entityConfiguration'].currentValue &&
      changes['entityConfiguration'].currentValue['BaseEntityId'] != null) {
      this.showMap();
      const contextData = {
        companyJobId: this.companyJobId,
        companyPayMarketId: this.companyPayMarketId,
        userSessionId: this.entityConfiguration.ParentEntityId,
        entityConfiguration: this.entityConfiguration,
        cutGuid: this.cutGuid
      };
      if (!!this.exchangeExplorer) {
        this.setContext(contextData);
      }
    }
  }

  setContext(contextData: any) {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: contextData
        }
      }
    } as MessageEvent;
    this.exchangeExplorer.onMessage(setContextMessage);


    // TODO: Validation in upcoming item [JP]
    if (!this.refining) {

      this.store.dispatch(new fromDataCutValidationActions.LoadDataCutValidation(
        {
          CompanyJobId: this.companyJobId,
          EntityConfiguration: this.entityConfiguration
        }
      ));
    }
  }

  showMap() {
    this.displayMap = true;
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.peerMapCompaniesSubscription.unsubscribe();
    this.weightingTypeSubscription.unsubscribe();
    this.persistedWeightingTypeForDataCutsSubscription.unsubscribe();
    this.loadedDataCutDetailsSubscription.unsubscribe();
  }

  setSubscriptions(): void {
    this.peerMapCompaniesSubscription = this.peerMapCompanies$.subscribe(pms => {
      if (this.displayMap) {
        this.guidelinesService.validateDataCut(pms, this.companyJobId, this.entityConfiguration, this.cutGuid);
      }
    });
    this.weightingTypeSubscription = this.weightingType$.subscribe(wts => {
      if (this.displayMap) {
        if (this.cutGuid !== null) {
          this.selectedWeightingType = Weights.find(w => w.Value === wts);
        }
      }
    });
    this.persistedWeightingTypeForDataCutsSubscription = this.persistedWeightingTypeForDataCuts$.subscribe(weightingType => {
      if (this.displayMap) {
        if (!!weightingType && this.cutGuid === null) {
          this.selectedWeightingType = Weights.find(w => w.Value === weightingType);
          this.store.dispatch(new fromLibsExchangeExplorerFilterContextActions
            .SetWeightingType({ weightingType: this.selectedWeightingType.Value }));
        }
      }
    });

    this.untaggedIncumbentCountSubscription = this.untaggedIncumbentCount$.subscribe( untaggedIncumbentCount => {
      if (this.displayMap) {
        this.untaggedIncumbentCount = untaggedIncumbentCount;
      }
    });

    this.loadedDataCutDetailsSubscription = this.loadedDataCutDetails$.subscribe(loadedDataCutDetails => {
      if (!!loadedDataCutDetails) {
        this.refinedDataCutDetails.emit(loadedDataCutDetails);
        this.reset();
      }
    });
  }

  refineExchangeJob(exchangeJobId: number): void {
    this.refining = true;
    this.showMap();
    this.setContext({refineExchangeJobId: exchangeJobId});
  }

  get untaggedIncumbentMessage(): string {
    if (this.untaggedIncumbentCount === 1) {
      return `Include ${this.untaggedIncumbentCount} incumbent that does not have location data`;
    }
    return `Include ${this.untaggedIncumbentCount} incumbents that do not have location data`;
  }
}
