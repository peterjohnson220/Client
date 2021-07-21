import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';

import {
  AdvancedModelSettingForm,
  generateMockRangeAdvancedSetting,
  RangeGroupMetadata
} from 'libs/models/structures';
import { AdjustMidpointTypes } from 'libs/constants/structures/adjust-midpoint-type';

import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import { AbstractModelSettingsContentComponent } from '../../model-settings-modal';

@Component({
  selector: 'pf-grade-based-model-settings-content',
  templateUrl: './grade-based-model-settings-content.component.html',
  styleUrls: ['./grade-based-model-settings-content.component.scss']
})
export class GradeBasedModelSettingsContentComponent extends AbstractModelSettingsContentComponent implements OnInit, OnDestroy {
  @Input() numGrades: number;
  @Output() adjustMidpointRadioButtonChanged = new EventEmitter();

  activeRangeTypeTab: string;
  modelSetting: RangeGroupMetadata;
  defaultAdvancedSettings: AdvancedModelSettingForm;
  adjustMidpointTypes = AdjustMidpointTypes;
  adjustMidpointMoveByType = AdjustMidpointTypes.MoveBy;

  constructor(
    public store: Store<any>
  ) {
    super(store);
  }

  // LifeCycle
  ngOnInit(): void {
    super.ngOnInit();
    this.metadataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metadata = md;
        this.activeRangeTypeTab = this.metadata.RangeDistributionTypes.find(t => t.Id === this.metadata.RangeDistributionTypeId).Type;
      }
    });
    this.store.dispatch(new fromModelSettingsModalActions.GetCurrencies());
    this.store.dispatch(new fromModelSettingsModalActions.GetControlPoints());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  handleRangeTypeChange(event) {
    this.activeRangeTypeTab = event.Type;
  }

  handlePayTypeFilterChange(value: string) {
    if (!!value) {
      const controlPointsResults = this.controlPointsAsyncObj.obj.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });
      this.controlPoints = controlPointsResults.filter(cp => {
        return cp.Display.toLowerCase().startsWith(value.toLowerCase()) ||
          cp.Category.toLowerCase().startsWith(value.toLowerCase());
      });
    } else {
      this.controlPoints = this.controlPointsAsyncObj.obj.filter((ctrlPt, i, arr) => {
        return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
      });
    }
  }

  handlePayTypeSelectionChange() {
    this.controlPoints = this.controlPointsAsyncObj.obj.filter((ctrlPt, i, arr) => {
      return arr.indexOf(arr.find(t => t.Category === ctrlPt.Category && t.RangeDisplayName === 'MRP')) === i;
    });
  }

  handleRateSelectionChange(value: string) {
    this.updateRoundingPoints(value);
    // if this is not a new model, and they change the value for rate, clear out starting midpoint
    if (!this.isNewModel) {
      this.formControls.StartingMidpoint.reset('');
    }
  }

  handleModalSubmit() {
    if (this.modelSettingsForm.valid) {
      const action = new fromModelSettingsModalActions.SaveGradeBasedModelSettings(
        {
          rangeGroupId: this.rangeGroupId,
          formValue: this.modelSetting,
          fromPageViewId: this.pageViewId,
          rounding: this.roundingSettings,
          isNewModel: this.isNewModel
        });
      this.store.dispatch(action);
      this.reset();
    }
  }

  get adjustMidpointSettingType() {
    return this.modelSettingsForm.get('AdjustMidpointSetting.Type');
  }

  get adjustMidpointSettingPercentage() {
    return this.modelSettingsForm.get('AdjustMidpointSetting.Percentage');
  }

  get disableNumGradesField() {
    return this.numGrades > 0;
  }

  handleModalSubmitAttempt() {
    this.attemptedSubmit = true;

    this.modelSetting = this.modelSettingsForm.getRawValue();
    this.generateAdvancedSettingsForm();
    this.updateRoundingSettings();

    if (!this.modelSettingsForm.valid) {
      this.activeTab = this.modelTabId;
    }
  }

  handleRadioButtonChanged(value: any) {
    this.adjustMidpointRadioButtonChanged.emit(value);
  }

  generateAdvancedSettingsForm() {
    if (this.metadata.RangeAdvancedSetting != null) {
      this.modelSetting.RangeAdvancedSetting = this.metadata.RangeAdvancedSetting;
    } else {
      this.defaultAdvancedSettings = generateMockRangeAdvancedSetting();
      this.modelSetting.RangeAdvancedSetting = this.defaultAdvancedSettings;
    }
  }
}
