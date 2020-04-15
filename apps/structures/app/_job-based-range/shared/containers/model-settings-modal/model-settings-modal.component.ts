import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { Currency, ControlPoint, RangeGroupMetadata, RoundingSettingsDataObj } from '../../models';
import { Pages } from '../../constants/pages';

@Component({
  selector: 'pf-model-settings-modal',
  templateUrl: './model-settings-modal.component.html',
  styleUrls: ['./model-settings-modal.component.scss']
})
export class ModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;

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
  isNewModelSub: Subscription;
  roundingSettingsSub: Subscription;


  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPoints: ControlPoint[];
  currencies: Currency[];
  metadata: RangeGroupMetadata;
  modelSettingsForm: FormGroup;
  attemptedSubmit: boolean;
  modelNameExistsFailure: boolean;
  isNewModel: any;
  roundingSettings: RoundingSettingsDataObj;
  activeTab: string;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRoundingSettings));
    this.modalOpen$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getModelSettingsModalOpen));
    this.currenciesAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getCurrenciesAsyncObj));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getControlPointsAsyncObj));
    this.structureNameSuggestionsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getStructureNameSuggestionsAsyncObj));
    this.savingModelSettingsAsyncObj$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getSavingModelSettingsAsyncObj));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getModelNameExistsFailure));
    this.isNewModelSub = this.store.pipe(select(fromSharedJobBasedRangeReducer.getIsNewModelModelSettings)).subscribe(isNewModel => {
        this.isNewModel = isNewModel;
      });
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
       return this.isNewModel ? 'New Model' :
      this.metadata.IsCurrent ? 'Create Model' : 'Edit Model';
  }

  get structureInputIsDisabled() {
    return this.metadata.IsCurrent || this.isNewModel;
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'structureName': new FormControl(this.metadata.StructureName, [Validators.required, Validators.maxLength(50)]),
      'modelName': new FormControl(!this.metadata.IsCurrent || this.isNewModel ? this.metadata.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'payMarket': new FormControl(this.metadata.Paymarket, [Validators.required]),
      'controlPoint': new FormControl(this.metadata.ControlPoint, [Validators.required]),
      'spreadMin': new FormControl(this.metadata.SpreadMin, [Validators.required]),
      'spreadMax': new FormControl(this.metadata.SpreadMax, [Validators.required]),
      'rate': new FormControl(this.metadata.Rate, [Validators.required]),
      'currency': new FormControl(this.metadata.Currency, [Validators.required])
    });
  }
  // Events
  handleModalSubmit() {
    if (this.modelSettingsForm.valid) {
      this.store.dispatch(new fromModelSettingsModalActions.SaveModelSettings(
        {
          rangeGroupId: this.rangeGroupId,
          formValue: this.modelSettingsForm.value,
          fromPage: this.page,
          rounding: this.roundingSettings
        })
      );
      this.reset();
    }
  }

  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;
    if (!this.modelSettingsForm.valid) {
      this.activeTab = 'modelTab';
    }
  }

  handleModalDismiss() {
    this.store.dispatch(new fromModelSettingsModalActions.CloseModal());
    this.reset();
  }

  handleControlPointFilterChange(value: string) {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter(cp => cp.Display.toLowerCase().startsWith(value.toLowerCase()));
  }

  handleControlPointSelectionChange() {
    this.controlPoints = this.controlPointsAsyncObj.obj;
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
      this.controlPoints = cp.obj;
    });

    this.currenciesAsyncObjSub = this.currenciesAsyncObj$.subscribe(c => {
      this.currenciesAsyncObj = c;
      this.currencies = c.obj;
    });

    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
    this.modalOpenSub = this.modalOpen$.subscribe(mo => mo ? this.buildForm() : false);
    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  private unsubscribe() {
    this.controlPointsAsyncObjSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
    this.metadataSub.unsubscribe();
    this.modalOpenSub.unsubscribe();
    this.modelNameExistsFailureSub.unsubscribe();
    this.isNewModelSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
  }

  private reset() {
    this.attemptedSubmit = false;
  }
}
