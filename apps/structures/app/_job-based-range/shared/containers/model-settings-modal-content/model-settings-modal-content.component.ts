import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { Observable, Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { delay } from 'rxjs/operators';

import { RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { AsyncStateObj } from 'libs/models/state';
import { GenericKeyValue } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';


import { ControlPoint, Currency, SelectedPeerExchangeModel } from '../../../../shared/models';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import { ModelSettingsModalConstants } from '../../../../shared/constants/model-settings-modal-constants';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import { AdvancedModelSettingComponent } from '../advanced-model-setting';

@Component({
  selector: 'pf-job-based-model-settings-modal-content',
  templateUrl: './model-settings-modal-content.component.html',
  styleUrls: ['./model-settings-modal-content.component.scss']
})
export class ModelSettingsModalContentComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() modalOpen: boolean;
  @Input() isNewModel: boolean;
  @Input() modelSettingsForm: FormGroup;
  @Input() selectedExchange: SelectedPeerExchangeModel;
  @ViewChild(RangeDistributionSettingComponent, { static: false }) public rangeDistributionSettingComponent: RangeDistributionSettingComponent;
  @ViewChild(AdvancedModelSettingComponent, { static: false }) public advancedModelSettingComponent: AdvancedModelSettingComponent;

  metaData$: Observable<RangeGroupMetadata>;
  currenciesAsyncObj$: Observable<AsyncStateObj<Currency[]>>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  surveyUdfsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  structureNameSuggestionsAsyncObj$: Observable<AsyncStateObj<string[]>>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;
  modelNameExistsFailure$: Observable<boolean>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  activeTab$: Observable<string>;

  controlPointsAsyncObjSub: Subscription;
  surveyUdfsAsyncObjSub: Subscription;
  currenciesAsyncObjSub: Subscription;
  metadataSub: Subscription;
  modelNameExistsFailureSub: Subscription;
  roundingSettingsSub: Subscription;
  allFormulasSub: Subscription;
  activeTabSub: Subscription;

  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  surveyUdfsAsyncObj: AsyncStateObj<ControlPoint[]>;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPoints: ControlPoint[];
  currencies: Currency[];
  metadata: RangeGroupMetadata;
  attemptedSubmit: boolean;
  modelNameExistsFailure: boolean;
  roundingSettings: RoundingSettingsDataObj;
  activeTab: string;
  modelSetting: RangeGroupMetadata;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;
  allFormulas = null;
  unsubscribe$ = new Subject<void>();
  exchanges: any;
  exchanges$: Observable<AsyncStateObj<GenericKeyValue<number, string>[]>>;
  exchangeSub: Subscription;
  exchangeNames: string[];
  hasAcceptedPeerTermsSub: Subscription;
  hasAcceptedPeerTerms: boolean;
  peerDropDownDisabled: boolean;
  peerExchangeToolTipInfo: string;

  constructor(
    public store: Store<any>,
    private settingsService: SettingsService,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));
    this.currenciesAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getCurrenciesAsyncObj));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getControlPointsAsyncObj));
    this.surveyUdfsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getSurveyUdfsAsyncObj));
    this.structureNameSuggestionsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getStructureNameSuggestionsAsyncObj));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getSavingModelSettingsAsyncObj));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedStructuresReducer.getModelNameExistsFailure));
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.peerExchangeToolTipInfo = ModelSettingsModalConstants.PEER_EXCHANGE_TOOL_TIP;
    this.allFormulasSub = this.store.pipe(select(fromSharedStructuresReducer.getAllFields)).subscribe(af => this.allFormulas = af);
    this.exchanges$ = this.store.pipe(select(fromSharedStructuresReducer.getCompanyExchanges));
    this.activeTab$ = this.store.pipe(select(fromSharedStructuresReducer.getActiveTab));
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

  get modelTabTitle() {
    return this.metadata.IsCurrent || this.isNewModel ? 'Model Settings' : 'Current Model Settings';
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
      this.store.dispatch(new fromSharedStructuresActions.SetSelectedPeerExchange(this.selectedExchange));
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
    let tab = this.activeTab;

    if (this.formulasInvalidForSubmission()) {
      tab = 'modelTab';
      return false;
    }

    this.modelSetting = this.modelSettingsForm.getRawValue();
    this.updateRangeDistributionSetting();
    this.updateSelectedPeerExchangeId();

    this.updateAdvancedModelingSetting();

    if (!this.modelSettingsForm.valid) {
      if (!this.modelSettingsForm.controls['RangeAdvancedSetting'].valid) {
        tab = 'advancedModelingTab';
      } else {
        tab = 'modelTab';
      }
    }

    this.store.dispatch(new fromModelSettingsModalActions.SetActiveTab(tab));
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
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoints({ RoundingPoint: roundingPoint }));
  }

  handlePeerExchangeSelectionChange(value: string) {
    if (value !== null) {
      const selection = this.exchanges.filter(x => x.Value === value);
      this.selectedExchange = {
        ExchangeId: selection[0].Key,
        ExchangeName: value
      };
    }
  }

  updateSelectedPeerExchangeId() {
    if (this.selectedExchange?.ExchangeId === null && this.hasAcceptedPeerTerms) {
      this.modelSetting.ExchangeId = this.assignDefaultSelectedExchangeId();
    } else if (this.selectedExchange?.ExchangeId === null || !this.hasAcceptedPeerTerms) {
      this.modelSetting.ExchangeId = null;
    } else {
      this.modelSetting.ExchangeId = this.selectedExchange.ExchangeId;
    }
  }

  assignDefaultSelectedExchangeId() {
    this.handlePeerExchangeSelectionChange('Global Network');
    return this.selectedExchange.ExchangeId;
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
    this.store.dispatch(new fromModelSettingsModalActions.GetSurveyUdfs());

    this.subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  private subscribe() {
    this.activeTabSub = this.activeTab$.subscribe(tab => {
      if (tab) {
        this.activeTab = tab;
      }
    });

    this.controlPointsAsyncObjSub = this.controlPointsAsyncObj$.subscribe(cp => {
      this.controlPointsAsyncObj = cp;
      this.controlPoints = cp.obj.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });
    });

    this.surveyUdfsAsyncObjSub = this.surveyUdfsAsyncObj$.subscribe(udfs => {
      this.surveyUdfsAsyncObj = udfs;
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
      }
    });

    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  private unsubscribe() {
    this.controlPointsAsyncObjSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.unsubscribe$.next();
    this.allFormulasSub.unsubscribe();
    this.exchangeSub.unsubscribe();
    this.hasAcceptedPeerTermsSub.unsubscribe();
    this.surveyUdfsAsyncObjSub.unsubscribe();
    this.activeTabSub.unsubscribe();
  }

  private reset() {
    this.attemptedSubmit = false;
  }


}
