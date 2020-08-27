import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AsyncStateObj } from 'libs/models/state';
import { RoundingSettingsDataObj } from 'libs/models/structures';
import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';

import * as fromMetadataActions from '../../../shared/actions/shared.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { ControlPoint, Currency, RangeGroupMetadata } from '../../models';
import { Pages } from '../../constants/pages';
import { UrlService } from '../../services';
import { Workflow } from '../../constants/workflow';
import { RangeDistributionSettingComponent } from '../range-distribution-setting';
import { ModelSettingsModalConstants } from '../../constants/model-settings-modal-constants';

@Component({
  selector: 'pf-model-settings-modal',
  templateUrl: './model-settings-modal.component.html',
  styleUrls: ['./model-settings-modal.component.scss']
})
export class ModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;
  @ViewChild(RangeDistributionSettingComponent, {static: false}) public rdSettingComponent: RangeDistributionSettingComponent;

  modalOpen$: Observable<boolean>;
  metaData$: Observable<RangeGroupMetadata>;
  currenciesAsyncObj$: Observable<AsyncStateObj<Currency[]>>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  structureNameSuggestionsAsyncObj$: Observable<AsyncStateObj<string[]>>;
  savingModelSettingsAsyncObj$: Observable<AsyncStateObj<null>>;
  modelNameExistsFailure$: Observable<boolean>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  enableJobRangeTypes$: Observable<boolean>;

  controlPointsAsyncObjSub: Subscription;
  currenciesAsyncObjSub: Subscription;
  metadataSub: Subscription;
  modalOpenSub: Subscription;
  modelNameExistsFailureSub: Subscription;
  roundingSettingsSub: Subscription;
  enableJobRangeTypesSub: Subscription;

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
  enableJobRangeTypes: boolean;
  modelSetting: RangeGroupMetadata;
  minSpreadTooltip: string;
  maxSpreadTooltip: string;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    public urlService: UrlService,
    private settingService: SettingsService
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
    this.enableJobRangeTypes$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.EnableJobRangeStructureRangeTypes
    );
    this.minSpreadTooltip = ModelSettingsModalConstants.MIN_SPREAD_TOOL_TIP;
    this.maxSpreadTooltip = ModelSettingsModalConstants.MAX_SPREAD_TOOL_TIP;
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

  get structureInputIsDisabled() {
    return this.metadata.IsCurrent || this.isNewModel;
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(this.metadata.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(!this.metadata.IsCurrent || this.isNewModel ? this.metadata.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(this.metadata.Paymarket, [Validators.required]),
      'ControlPoint': new FormControl(this.metadata.ControlPoint, [Validators.required]),
      'SpreadMin': new FormControl(this.metadata.SpreadMin, [this.enableJobRangeTypes ? Validators.nullValidator : Validators.required]),
      'SpreadMax': new FormControl(this.metadata.SpreadMax, [this.enableJobRangeTypes ? Validators.nullValidator : Validators.required]),
      'Rate': new FormControl(this.metadata.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metadata.Currency || 'USD', [Validators.required]),
      'RangeDistributionSetting': new FormControl(this.metadata.RangeDistributionSetting),
      'RangeDistributionTypeId': new FormControl(this.metadata.RangeDistributionTypeId),
    });
    // set active tab to model
    this.activeTab = 'modelTab';
  }

  // Events
  handleModalSubmit() {
    if (this.modelSettingsForm.valid) {
      this.store.dispatch(new fromModelSettingsModalActions.SaveModelSettings(
        {
          rangeGroupId: this.rangeGroupId,
          formValue: this.modelSetting,
          fromPage: this.page,
          rounding: this.roundingSettings
        })
      );
      this.reset();
    }
  }

  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;
    this.modelSetting = this.modelSettingsForm.getRawValue();
    if (this.enableJobRangeTypes) {
      // Set value for control point, range spread min and max
      this.updateRangeTypeSetting();
    }
    if (!this.modelSettingsForm.valid) {
      this.activeTab = 'modelTab';
    }
  }

  updateRangeTypeSetting() {
    const setting = this.rdSettingComponent.rangeDistributionSettingForm.getRawValue();

    if (!!setting) {
      // Prevent the hidden controls from failing validation
      this.modelSettingsForm.controls['SpreadMin'].setValue(setting.Minimum);
      this.modelSettingsForm.controls['SpreadMax'].setValue(setting.Maximum);
      this.modelSettingsForm.controls['ControlPoint'].setValue(setting.RangeBasedOn);
      this.modelSettingsForm.controls['RangeDistributionTypeId'].setValue(setting.RangeDistributionTypeId);

      this.modelSetting = this.modelSettingsForm.getRawValue();
      this.modelSetting.RangeDistributionSetting = setting;
    }
  }

  handleModalDismiss() {
    this.store.dispatch(new fromModelSettingsModalActions.Cancel());
    this.store.dispatch(new fromModelSettingsModalActions.CloseModal());
    this.clearModelNameExistsFailure();
    this.reset();
  }

  handleControlPointFilterChange(value: string) {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP' &&
        (t.Display.toLowerCase().startsWith(value.toLowerCase()) || t.Display.toLowerCase().includes(value.toLowerCase())))) === i;
    });
  }

  handleControlPointSelectionChange() {
    this.controlPoints = this.controlPoints;
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
    this.store.dispatch(new fromMetadataActions.UpdateRoundingPoints({RoundingPoint: roundingPoint}));
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
    this.enableJobRangeTypesSub = this.enableJobRangeTypes$.subscribe(c => this.enableJobRangeTypes = c);

  }

  private unsubscribe() {
    this.controlPointsAsyncObjSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.modalOpenSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.enableJobRangeTypesSub.unsubscribe();
  }

  private reset() {
    this.attemptedSubmit = false;
  }
}
