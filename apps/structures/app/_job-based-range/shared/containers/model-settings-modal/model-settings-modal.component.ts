import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AsyncStateObj } from 'libs/models/state';
import { RoundingSettingsDataObj, RangeGroupMetadata } from 'libs/models/structures';
import { SettingsService } from 'libs/state/app-context/services';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';

import * as fromMetadataActions from '../../../shared/actions/shared.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
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
  waitingForFormulaValidationSub: Subscription;
  formulaValidatingSub: Subscription;
  formulaValidSub: Subscription;
  formulaSavingErrorSub: Subscription;
  formulaFieldSub: Subscription;

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
  waitingForFormulaValidation = false;
  formulaValidating = false;
  formulaValid = false;
  formulaSavingError = false;
  formulaField = null;
  structuresAdvancedModelingFeatureFlag: RealTimeFlag = { key: FeatureFlags.StructuresAdvancedModeling, value: false };
  unsubscribe$ = new Subject<void>();

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    public urlService: UrlService,
    private settingService: SettingsService,
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
    this.waitingForFormulaValidationSub = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaWaitingForValidation))
      .subscribe(fwfv => this.waitingForFormulaValidation = fwfv);
    this.formulaValidatingSub = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValidating)).subscribe(fv => this.formulaValidating = fv);
    this.formulaValidSub = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaValid)).subscribe(fv => this.formulaValid = fv);
    this.formulaSavingErrorSub = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaSavingError)).subscribe(fse => this.formulaSavingError = fse);
    this.formulaFieldSub = this.store.pipe(select(fromJobBasedRangeReducer.getFormulaField)).subscribe(ff => this.formulaField = ff);
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
    this.featureFlagService.bindEnabled(this.structuresAdvancedModelingFeatureFlag, this.unsubscribe$);
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
      'PayType': new FormControl(this.metadata.PayType, [Validators.required]),
      'ControlPoint': new FormControl(this.metadata.ControlPoint, [Validators.required]),
      'SpreadMin': new FormControl(this.metadata.SpreadMin),
      'SpreadMax': new FormControl(this.metadata.SpreadMax),
      'Rate': new FormControl(this.metadata.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metadata.Currency || 'USD', [Validators.required]),
      'RangeDistributionSetting': new FormControl(this.metadata.RangeDistributionSetting),
      'RangeDistributionTypeId': new FormControl(this.metadata.RangeDistributionTypeId),
      'RangeAdvancedSetting': new FormControl(this.metadata.RangeAdvancedSetting)
    });
    // set active tab to model
    this.activeTab = 'modelTab';
  }

  // Events
  handleModalSubmit() {
    if (this.modelSettingsForm.valid) {
      if (this.metadata.PayType !== this.modelSetting.PayType) {
        this.store.dispatch(new fromSharedJobBasedRangeActions.GetStructureHasPublishedForType({
          RangeGroupId: this.rangeGroupId,
          PaymarketId: this.metadata.PaymarketId,
          DistributionTypeId: this.metadata.RangeDistributionTypeId,
          PayType: this.modelSetting.PayType
        }));
      }
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

  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;

    if (this.formulaSavingError || this.waitingForFormulaValidation || this.formulaValidating
      || this.formulaField != null && !this.formulaValid) {
      this.activeTab = 'modelTab';
      return false;
    }

    this.modelSetting = this.modelSettingsForm.getRawValue();
    this.updateRangeDistributionSetting();
    this.updateAdvancedModelingSetting();

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
      // Prevent the hidden controls from failing validation
      this.modelSettingsForm.controls['SpreadMin'].setValue(setting.Minimum);
      this.modelSettingsForm.controls['SpreadMax'].setValue(setting.Maximum);

      if (!!setting.ControlPoint) {
        this.modelSettingsForm.controls['ControlPoint'].setValue(setting.ControlPoint);
        this.setRequired('ControlPoint');
        if (!!this.modelSetting.RangeDistributionSetting && this.modelSetting.RangeDistributionSetting.ControlPoint_Formula != null) {
          this.modelSetting.RangeDistributionSetting.ControlPoint_Formula = null;
        }
      }

      if (!!setting.ControlPoint_Formula?.Formula) {
        if (!this.modelSetting.RangeDistributionSetting.ControlPoint_Formula.IsPublic) {
          this.modelSetting.RangeDistributionSetting.ControlPoint_Formula.IsPublic = true;
        }
        this.modelSettingsForm.controls['ControlPoint'].setValue(null);
        this.clearRequiredValidator('ControlPoint');
      }

      this.modelSettingsForm.controls['RangeDistributionTypeId'].setValue(setting.RangeDistributionTypeId);
      this.modelSettingsForm.controls['PayType'].setValue(setting.PayType);

      this.modelSetting = this.modelSettingsForm.getRawValue();
      this.modelSetting.RangeDistributionSetting = setting;

      if (!setting.ControlPoint_Formula?.Formula) {
        this.modelSetting.RangeDistributionSetting.ControlPoint_Formula = null;
      }
    }
  }

  updateAdvancedModelingSetting() {
    const setting = this.advancedModelSettingComponent.advancedModelSettingForm.getRawValue();
    if (!!setting) {
      this.modelSetting.RangeAdvancedSetting = setting;
    }
  }

  setRequired(controlName: string) {
    this.modelSettingsForm.get(controlName).setValidators([Validators.required]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  clearRequiredValidator(controlName: string) {
    this.modelSettingsForm.get(controlName).reset();
    this.modelSettingsForm.get(controlName).clearValidators();
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
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

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
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
    this.waitingForFormulaValidationSub.unsubscribe();
    this.formulaValidatingSub.unsubscribe();
    this.formulaValidSub.unsubscribe();
    this.formulaSavingErrorSub.unsubscribe();
    this.formulaFieldSub.unsubscribe();
    this.unsubscribe$.next();
  }

  private reset() {
    this.attemptedSubmit = false;
  }
}
