import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AsyncStateObj, Currency, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models';
import { RoundingTypes } from 'libs/constants/structures/rounding-type';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';
import * as fromSharedStructuresActions from '../../actions/shared.actions';
import { ControlPoint } from '../../models';
import { RangeRoundingComponent } from '../range-rounding';

@Component({
  template: ''
})
export abstract class AbstractModelSettingsContentComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() isNewModel: boolean;
  @Input() modelSettingsForm: FormGroup;

  @ViewChild(RangeRoundingComponent, { static: false }) public rangeRoundingComponent: RangeRoundingComponent;

  metaData$: Observable<RangeGroupMetadata>;
  modelNameExistsFailure$: Observable<boolean>;
  controlPointsAsyncObj$: Observable<AsyncStateObj<ControlPoint[]>>;
  currenciesAsyncObj$: Observable<AsyncStateObj<Currency[]>>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;

  modelNameExistsFailureSub: Subscription;
  controlPointsAsyncObjSub: Subscription;
  currenciesAsyncObjSub: Subscription;
  roundingSettingsSub: Subscription;

  metadata: RangeGroupMetadata;
  activeTab: string;
  attemptedSubmit: boolean;
  modelNameExistsFailure: boolean;
  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  controlPoints: ControlPoint[];
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  currencies: Currency[];
  roundingSettings: RoundingSettingsDataObj;
  modelTabId = 'modelTab';

  constructor(
    public store: Store<any>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.modelNameExistsFailure$ = this.store.pipe(select(fromSharedStructuresReducer.getModelNameExistsFailure));
    this.controlPointsAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getControlPointsAsyncObj));
    this.currenciesAsyncObj$ = this.store.pipe(select(fromSharedStructuresReducer.getCurrenciesAsyncObj));
    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));
  }

  ngOnInit(): void {
    this.activeTab = this.modelTabId;
    this.modelNameExistsFailureSub = this.modelNameExistsFailure$.subscribe(mef => this.modelNameExistsFailure = mef);
    this.currenciesAsyncObjSub = this.currenciesAsyncObj$.subscribe(c => {
      this.currenciesAsyncObj = c;
      this.currencies = c.obj;
    });
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
    this.controlPointsAsyncObjSub = this.controlPointsAsyncObj$.subscribe(asyncObj => {
      if (asyncObj?.obj?.length) {
        this.setControlPoints(asyncObj);
      }
    });
  }

  ngOnDestroy(): void {
    this.modelNameExistsFailureSub.unsubscribe();
    this.currenciesAsyncObjSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.controlPointsAsyncObjSub.unsubscribe();
  }

  get formControls() {
    return this.modelSettingsForm.controls;
  }

  get errors() {
    return this.modelSettingsForm.errors;
  }

  get modelTabTitle() {
    return this.metadata?.IsCurrent || this.isNewModel ? 'Model Settings' : 'Current Model Settings';
  }

  reset(): void {
    this.attemptedSubmit = false;
    this.activeTab = this.modelTabId;
  }

  clearModelNameExistsFailure() {
    if (this.modelNameExistsFailure) {
      this.store.dispatch(new fromModelSettingsModalActions.ClearModelNameExistsFailure());
    }
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

  updateRoundingSettings() {
    const settings = this.rangeRoundingComponent.roundingSettingsForm.getRawValue();
    if (!!settings) {
      this.roundingSettings = settings;
    }
  }

  markFormDirty(): void {
    this.modelSettingsForm.markAsDirty();
  }

  protected updateRoundingPoints(value: string): void {
    const roundingPoint = value.toLowerCase() === 'hourly' ? 2 : 0;
    this.store.dispatch(new fromSharedStructuresActions.UpdateRoundingPoints({RoundingType: RoundingTypes.Round, RoundingPoint: roundingPoint }));
  }

  protected setControlPoints(asyncObj: AsyncStateObj<ControlPoint[]>): void {
    this.controlPointsAsyncObj = asyncObj;
    this.controlPoints = asyncObj.obj.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
    });
  }

  public handleModalSubmit(): void {}
  public handleModalSubmitAttempt(): void {}
}
