import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AsyncStateObj } from 'libs/models/state';
import { RoundingSettingsDataObj, RangeGroupMetadata } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { GenericKeyValue } from 'libs/models/common';
import { CompanySettingsEnum } from 'libs/models/company';

import * as fromMetadataActions from '../../../shared/actions/shared.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { ControlPoint, Currency } from '../../models';
import { UrlService } from '../../services';
import { Workflow } from '../../constants/workflow';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import { ModelSettingsModalConstants } from '../../constants/model-settings-modal-constants';
import { AdvancedModelSettingComponent } from '../advanced-model-setting';

@Component({
  selector: 'pf-model-settings-modal',
  templateUrl: './model-settings-modal.component.html',
  styleUrls: ['./model-settings-modal.component.scss']
})
export class ModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @ViewChild(RangeDistributionSettingComponent, { static: false }) public rangeDistributionSettingComponent: RangeDistributionSettingComponent;
  @ViewChild(AdvancedModelSettingComponent, { static: false }) public advancedModelSettingComponent: AdvancedModelSettingComponent;

  modalOpen$: Observable<boolean>;
  metaData$: Observable<RangeGroupMetadata>;
  currenciesAsyncObj$: Observable<AsyncStateObj<Currency[]>>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  structureNameSuggestionsAsyncObj$: Observable<AsyncStateObj<string[]>>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;
  modelNameExistsFailure$: Observable<boolean>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;

  controlPointsAsyncObjSub: Subscription;
  currenciesAsyncObjSub: Subscription;
  metadataSub: Subscription;
  modalOpenSub: Subscription;
  modelNameExistsFailureSub: Subscription;
  roundingSettingsSub: Subscription;
  allFormulasSub: Subscription;

  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPoints: ControlPoint[];
  currencies: Currency[];
  metadata: RangeGroupMetadata;
  modelSettingsForm: FormGroup;
  attemptedSubmit: boolean;
  modelNameExistsFailure: boolean;
  isNewModel: boolean;
  roundingSettings: RoundingSettingsDataObj;
  activeTab: string;
  modelSetting: RangeGroupMetadata;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;
  allFormulas = null;
  structuresAdvancedModelingFeatureFlag: RealTimeFlag = { key: FeatureFlags.StructuresAdvancedModeling, value: false };
  unsubscribe$ = new Subject<void>();
  exchanges: any;
  exchanges$: Observable<AsyncStateObj<GenericKeyValue<number, string>[]>>;
  exchangeSub: Subscription;
  exchangeNames: string[];
  selectedExchangeDict: GenericKeyValue<number, string>[];
  selectedExchange: string;
  selectedExchangeId: number;
  hasAcceptedPeerTermsSub: Subscription;
  hasAcceptedPeerTerms: boolean;
  peerDropDownDisabled: boolean;
  peerExchangeToolTipInfo: string;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    public urlService: UrlService,
    private settingsService: SettingsService,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRoundingSettings));
    // delay(0) to push this into the next VM turn to avoid expression changed errors
    this.modalOpen$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getModelSettingsModalOpen), delay(0));
    this.currenciesAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getCurrenciesAsyncObj));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getControlPointsAsyncObj));
    this.structureNameSuggestionsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getStructureNameSuggestionsAsyncObj));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getSavingModelSettingsAsyncObj));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getModelNameExistsFailure));
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.peerExchangeToolTipInfo = ModelSettingsModalConstants.PEER_EXCHANGE_TOOL_TIP;
    this.featureFlagService.bindEnabled(this.structuresAdvancedModelingFeatureFlag, this.unsubscribe$);
    this.allFormulasSub = this.store.pipe(select(fromJobBasedRangeReducer.getAllFields)).subscribe(af => this.allFormulas = af);
    this.exchanges$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getCompanyExchanges));
    this.hasAcceptedPeerTermsSub = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.PeerTermsAndConditionsAccepted
    ).subscribe(x => this.hasAcceptedPeerTerms = x);
  }

  get formControls() {
    return this.modelSettingsForm.controls;
  }

  get errors() {
    return this.modelSettingsForm.errors;
  }

  get buttonPrimaryText() {
    return this.metadata.IsCurrent ? 'Create Model' : 'Save';
  }

  get buttonPrimaryTextSubmitting() {
    return this.metadata.IsCurrent ? 'Creating Model...' : 'Saving...';
  }

  get modelTabTitle() {
    return this.metadata.IsCurrent || this.isNewModel ? 'Model Settings' : 'Current Model Settings';
  }

  get modalTitle() {
    return this.metadata.StructureName;
  }

  get modalSubTitle() {
    return this.metadata.Paymarket;
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(this.metadata.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(!this.metadata.IsCurrent || this.isNewModel ? this.metadata.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(this.metadata.Paymarket, [Validators.required]),
      'Rate': new FormControl(this.metadata.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metadata.Currency || 'USD', [Validators.required]),
      'PeerExchange': new FormControl(this.selectedExchange || 'Global Network', [Validators.required]),
      'RangeDistributionSetting': new FormControl(this.metadata.RangeDistributionSetting),
      'RangeAdvancedSetting': new FormControl(this.metadata.RangeAdvancedSetting)
    });
    // set active tab to model
    this.activeTab = 'modelTab';
  }

  // Events
  handleModalSubmit() {
    if (this.modelSettingsForm.valid && !this.formulasInvalidForSubmission()) {
      this.store.dispatch(new fromModelSettingsModalActions.SaveModelSettings(
        {
          rangeGroupId: this.rangeGroupId,
          formValue: this.modelSetting,
          fromPageViewId: this.pageViewId,
          rounding: this.roundingSettings
        })
      );
      this.reset();
    }
  }

  formulasInvalidForSubmission(): boolean {
    // this.formulaSavingError || this.waitingForFormulaValidation || this.formulaValidating
    // || this.formulaField != null && !this.formulaValid)
    // check min
    if (!!this.allFormulas.Min && (this.allFormulas.Min.savingError || this.allFormulas.Min.waitingForValidation || this.allFormulas.Min.validating
      || (this.allFormulas.Min.formulaField != null && !this.allFormulas.Min.formulaValid))) {
      return true;
    }
    // check mid
    if (!!this.allFormulas.Mid && (this.allFormulas.Mid.savingError || this.allFormulas.Mid.waitingForValidation || this.allFormulas.Mid.validating
      || (this.allFormulas.Mid.formulaField != null && !this.allFormulas.Mid.formulaValid))) {
      return true;
    }
    // check max
    if (!!this.allFormulas.Max && (this.allFormulas.Max.savingError || this.allFormulas.Max.waitingForValidation || this.allFormulas.Max.validating
      || (this.allFormulas.Max.formulaField != null && !this.allFormulas.Max.formulaValid))) {
      return true;
    }
    // if we made it to here, they are valid
    return false;
  }

  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;

    if (this.formulasInvalidForSubmission()) {
      this.activeTab = 'modelTab';
      return false;
    }

    this.modelSetting = this.modelSettingsForm.getRawValue();
    this.updateRangeDistributionSetting();
    this.updateSelectedPeerExchangeId();

    if (this.structuresAdvancedModelingFeatureFlag.value) {
      this.updateAdvancedModelingSetting();
    }

    if (!this.modelSettingsForm.valid) {
      if (!this.modelSettingsForm.controls['RangeAdvancedSetting'].valid) {
        this.activeTab = 'advancedModelingTab';
      } else {
        this.activeTab = 'modelTab';
      }
    }
  }

  updateRangeDistributionSetting() {
    const setting = this.rangeDistributionSettingComponent.rangeDistributionSettingForm.getRawValue();
    if (!!setting) {
      this.modelSetting.RangeDistributionSetting = setting;
    }
  }

  updateAdvancedModelingSetting() {
    const setting = this.advancedModelSettingComponent.advancedModelSettingForm.getRawValue();
    if (!!setting) {
      this.modelSetting.RangeAdvancedSetting = setting;
    }
  }

  handleModalDismiss() {
    this.store.dispatch(new fromModelSettingsModalActions.Cancel());
    this.store.dispatch(new fromModelSettingsModalActions.CloseModal());
    this.clearModelNameExistsFailure();
    this.reset();
  }

  handleCurrencyFilterChange(value: string) {
    this.currencies = this.currenciesAsyncObj.obj.filter(cp => {
      return cp.CurrencyCode.toLowerCase().startsWith(value.toLowerCase()) ||
        cp.CurrencyName.toLowerCase().startsWith(value.toLowerCase());
    });
  }

  handleCurrencySelectionChange() {
    this.currencies = this.currenciesAsyncObj.obj;
  }

  handleStructureNameChanged(value: string) {
    this.store.dispatch(new fromModelSettingsModalActions.GetStructureNameSuggestions({ filter: value }));
  }

  handleRateSelectionChange(value: string) {
    const roundingPoint = value.toLowerCase() === 'hourly' ? 2 : 0;
    this.store.dispatch(new fromMetadataActions.UpdateRoundingPoints({ RoundingPoint: roundingPoint }));
  }

  handlePeerExchangeSelectionChange(value: string) {
    if (value !== null) {
      const selectedExchange = this.exchanges.filter(x => x.Value === value);
      this.selectedExchangeId = selectedExchange[0].Key;
      this.updateSelectedPeerExchangeName(this.selectedExchangeId);
    }
  }

  updateSelectedPeerExchangeId() {
    if ((this.selectedExchangeId === null || this.selectedExchangeId === undefined) && this.hasAcceptedPeerTerms) {
      this.modelSetting.ExchangeId = this.assignDefaultSelectedExchangeId();
    } else if (this.selectedExchangeId === null || this.selectedExchangeId === undefined) {
      this.modelSetting.ExchangeId = null;
    } else {
      this.modelSetting.ExchangeId = this.selectedExchangeId;
    }
  }

  assignDefaultSelectedExchangeId() {
    this.handlePeerExchangeSelectionChange('Global Network');
    return this.selectedExchangeId;
  }

  updateSelectedPeerExchangeName(exchangeId: number) {
    if (exchangeId) {
      this.selectedExchangeDict = this.exchanges.filter(x => x.Key === exchangeId);
      this.selectedExchange = this.selectedExchangeDict.length > 0 ? this.selectedExchangeDict[0].Value : null;
    }
  }

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
    }
  }

  handlePayTypeSelectionChange(value: ControlPoint) {
    if ( value.PayTypeDisplay === 'TCC' || value.PayTypeDisplay === 'Base') {
      this.peerDropDownDisabled = false;
    } else {
      this.peerDropDownDisabled = true;
    }
  }

  // Lifecycle
  ngOnInit(): void {
    this.store.dispatch(new fromModelSettingsModalActions.GetCurrencies());
    this.store.dispatch(new fromModelSettingsModalActions.GetControlPoints());

    this.subscribe();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.controlPointsAsyncObjSub = this.controlPointsAsyncObj$.subscribe(cp => {
      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });
    });

    this.currenciesAsyncObjSub = this.currenciesAsyncObj$.subscribe(c => {
      this.currenciesAsyncObj = c;
      this.currencies = c.obj;
    });

    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);

    this.exchangeSub = this.exchanges$.subscribe(exs => {
      this.exchanges = exs.obj;
      if (this.exchanges) {
        const values = Object.values(this.exchanges);
        const names = [];
        values.forEach(function(item: GenericKeyValue<number, string>) {
          names.push(item.Value);
        });
        this.exchangeNames = names;
        if (this.metadata.ExchangeId !== undefined) {
          this.selectedExchangeId = this.metadata.ExchangeId;
          this.updateSelectedPeerExchangeName(this.metadata.ExchangeId);
        }
      }
    });

    this.modalOpenSub = this.modalOpen$.subscribe(mo => {
      if (mo) {
        this.buildForm();
        this.isNewModel = this.urlService.isInWorkflow(Workflow.NewJobBasedRange);
      }
    });
    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  private unsubscribe() {
    this.controlPointsAsyncObjSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.modalOpenSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.unsubscribe$.next();
    this.allFormulasSub.unsubscribe();
    this.exchangeSub.unsubscribe();
    this.hasAcceptedPeerTermsSub.unsubscribe();
  }

  private reset() {
    this.attemptedSubmit = false;
  }
}
