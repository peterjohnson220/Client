import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { RangeGroupMetadata } from 'libs/models/structures';
import { AsyncStateObj } from 'libs/models/state';
import { GenericKeyValue } from 'libs/models/common';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';

import { ControlPoint, SelectedPeerExchangeModel } from '../../../../shared/models';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import { ModelSettingsModalConstants } from '../../../../shared/constants/model-settings-modal-constants';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import { AdvancedModelSettingComponent } from '../advanced-model-setting';
import { AbstractModelSettingsContentComponent } from '../../model-settings-modal';

@Component({
  selector: 'pf-job-based-model-settings-content',
  templateUrl: './job-based-model-settings-content.component.html',
  styleUrls: ['./job-based-model-settings-content.component.scss']
})
export class JobBasedModelSettingsContentComponent extends AbstractModelSettingsContentComponent implements OnInit, OnDestroy  {
  @ViewChild(RangeDistributionSettingComponent, { static: false }) public rangeDistributionSettingComponent: RangeDistributionSettingComponent;
  @ViewChild(AdvancedModelSettingComponent, { static: false }) public advancedModelSettingComponent: AdvancedModelSettingComponent;

  selectedPeerExchange$: Observable<SelectedPeerExchangeModel>;

  selectedExchange: SelectedPeerExchangeModel;
  structureNameSuggestionsAsyncObj$: Observable<AsyncStateObj<string[]>>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;

  allFormulasSub: Subscription;
  metadataSub: Subscription;
  selectedPeerExchangeSubscription: Subscription;

  modelSetting: RangeGroupMetadata;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;
  allFormulas = null;
  exchanges: SelectedPeerExchangeModel[];
  exchanges$: Observable<AsyncStateObj<GenericKeyValue<number, string>[]>>;
  exchangeSub: Subscription;
  hasAcceptedPeerTermsSub: Subscription;
  hasAcceptedPeerTerms: boolean;
  peerDropDownDisabled: boolean;
  peerExchangeToolTipInfo: string;

  constructor(
    public store: Store<any>,
    private settingsService: SettingsService
  ) {
    super(store);
    this.structureNameSuggestionsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getStructureNameSuggestionsAsyncObj));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getSavingModelSettingsAsyncObj));
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.peerExchangeToolTipInfo = ModelSettingsModalConstants.PEER_EXCHANGE_TOOL_TIP;
    this.allFormulasSub = this.store.pipe(select(fromSharedStructuresReducer.getAllFields)).subscribe(af => this.allFormulas = af);
    this.exchanges$ = this.store.pipe(select(fromSharedStructuresReducer.getCompanyExchanges));
    this.hasAcceptedPeerTermsSub = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.PeerTermsAndConditionsAccepted
    ).subscribe(x => this.hasAcceptedPeerTerms = x);
    this.selectedPeerExchange$ = this.store.pipe(select(fromSharedStructuresReducer.getSelectedPeerExchange));
  }

  // Lifecycle
  ngOnInit(): void {
    super.ngOnInit();
    this.subscribe();

    this.store.dispatch(new fromModelSettingsModalActions.GetCurrencies());
    this.store.dispatch(new fromModelSettingsModalActions.GetControlPoints());
    this.store.dispatch(new fromModelSettingsModalActions.GetSurveyUdfs());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.unsubscribe();
  }

  // Events
  handleModalSubmit() {
    if (this.modelSettingsForm.valid && !this.formulasInvalidForSubmission()) {
      this.store.dispatch(new fromModelSettingsModalActions.SaveJobBasedModelSettings(
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
      this.activeTab = this.modelTabId;
      return false;
    }

    this.modelSetting = this.modelSettingsForm.getRawValue();
    this.updateRangeDistributionSetting();
    this.updateSelectedPeerExchangeId();

    this.updateAdvancedModelingSetting();
    this.updateRoundingSettings();

    if (!this.modelSettingsForm.valid) {
      if (!this.modelSettingsForm.controls['RangeAdvancedSetting'].valid) {
        tab = 'advancedModelingTab';
      } else {
        tab = this.modelTabId;
      }
    }

    this.activeTab = tab;
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

  handleStructureNameChanged(value: string) {
    this.store.dispatch(new fromModelSettingsModalActions.GetStructureNameSuggestions({ filter: value }));
  }

  handleRateSelectionChange(value: string) {
    this.updateRoundingPoints(value);
  }

  updateSelectedPeerExchangeId() {
    if (this.selectedExchange?.ExchangeId === null && this.hasAcceptedPeerTerms) {
      this.assignDefaultSelectedExchangeId();
    } else if (this.selectedExchange?.ExchangeId === null || !this.hasAcceptedPeerTerms) {
      this.modelSetting.ExchangeId = null;
    } else {
      this.modelSetting.ExchangeId = this.selectedExchange.ExchangeId;
    }
  }

  handlePayTypeSelectionChange(value: ControlPoint) {
    if (value.PayTypeDisplay === 'TCC' || value.PayTypeDisplay === 'Base') {
      this.peerDropDownDisabled = false;
    } else {
      this.peerDropDownDisabled = true;
    }
  }

  private assignDefaultSelectedExchangeId(): void {
    this.selectedExchange = this.exchanges.find(x => x.ExchangeName === 'Global Network');
    this.modelSetting.ExchangeId = this.selectedExchange.ExchangeId;
  }

  private subscribe() {
    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
    this.exchangeSub = this.exchanges$.subscribe(exs => {
      if (exs?.obj) {
        this.exchanges = exs.obj.map(x => ({ ExchangeId: x.Key, ExchangeName: x.Value }));
      }
    });
    this.selectedPeerExchangeSubscription = this.selectedPeerExchange$.subscribe(exchange => this.selectedExchange = exchange);
  }

  private unsubscribe() {
    this.allFormulasSub.unsubscribe();
    this.exchangeSub.unsubscribe();
    this.hasAcceptedPeerTermsSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.selectedPeerExchangeSubscription.unsubscribe();
  }
}
