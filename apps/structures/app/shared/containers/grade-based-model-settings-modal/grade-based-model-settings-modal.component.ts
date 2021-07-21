import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models';
import { AdjustMidpointTypes } from 'libs/constants/structures/adjust-midpoint-type';
import { PfValidators } from 'libs/forms';

import * as fromSharedStructuresReducer from '../../reducers';
import { AbstractModelSettingsModalComponent } from '../model-settings-modal';
import { GradeBasedModelSettingsContentComponent } from './grade-based-model-settings-content';

@Component({
  selector: 'pf-grade-based-model-settings-modal',
  templateUrl: './grade-based-model-settings-modal.component.html'
})
export class GradeBasedModelSettingsModalComponent extends AbstractModelSettingsModalComponent implements OnInit, OnDestroy {
  @ViewChild(GradeBasedModelSettingsContentComponent, { static: false }) protected modelContentComponent: GradeBasedModelSettingsContentComponent;

  gradeDetails$: Observable<AsyncStateObj<any>>;

  gradeDetailsSubscription: Subscription;

  numGrades: number;

  constructor(
    public sharedStore: Store<fromSharedStructuresReducer.State>
  ) {
    super(sharedStore);
    this.modalOpen$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getGradeModelSettingsModalOpen));
    this.gradeDetails$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getGradesDetails));
    this.buildForm();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.gradeDetailsSubscription = this.gradeDetails$.subscribe(asyncObj => {
      if (asyncObj?.obj) {
        this.numGrades = asyncObj?.obj.length;
        this.updateGrades();
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.gradeDetailsSubscription.unsubscribe();
  }

  get controlPoint(): string {
    return this.metaData?.PayType ? this.metaData.PayType + 'MRP' : 'BaseMRP';
  }

  handleAdjustMidpointRadioButtonChanged(event: any) {
    this.clearValidators('AdjustMidpointSetting.Percentage');
    if (event.target.id === 'AdjustMidpointMoveBy') {
      this.setValidators('AdjustMidpointSetting.Percentage', 0.01, 300);
    }
  }

  protected buildForm(): void  {
    this.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl('', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(50)]),
      'Grades': new FormControl(0),
      'RangeDistributionTypeId': new FormControl(null, [Validators.required]),
      'MarketDataBased': new FormControl('', [Validators.required]),
      'StartingMidpoint': new FormControl(''),
      'RangeSpread': new FormControl(''),
      'MidpointProgression': new FormControl(''),
      'Rate': new FormControl('', [Validators.required]),
      'Currency': new FormControl('', [Validators.required]),
      'AdjustMidpointSetting': new FormGroup({
        'Type': new FormControl(AdjustMidpointTypes.NoChange),
        'Percentage': new FormControl(null)
      })
    });
  }

  protected updateForm(): void {
    if (!this.metaData || !this.modelSettingsForm) {
      return;
    }
    this.modelSettingsForm.patchValue({
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      RangeDistributionTypeId: this.metaData.RangeDistributionTypeId,
      MarketDataBased: this.controlPoint || 'BaseMRP',
      StartingMidpoint: this.metaData.StartingMidpoint || '',
      RangeSpread: this.metaData.SpreadMin || '',
      MidpointProgression: this.metaData.MidpointProgression || '',
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD'
    });
    if (!this.metaData.IsCurrent) {
      this.setRequiredValidator('RangeSpread');
      this.setRequiredValidator('MidpointProgression');
    }
  }

  protected resetForm(): void {
    this.modelSettingsForm.reset({
      ModelName: !this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '',
      Grades: this.numGrades,
      RangeDistributionTypeId: this.metaData.RangeDistributionTypeId,
      MarketDataBased: this.controlPoint,
      StartingMidpoint: this.metaData.StartingMidpoint || '',
      RangeSpread: this.metaData.SpreadMin || '',
      MidpointProgression: this.metaData.MidpointProgression || '',
      Rate: this.metaData.Rate || 'Annual',
      Currency: this.metaData.Currency || 'USD',
      AdjustMidpointSetting: { Type: AdjustMidpointTypes.NoChange }
    });
  }

  private updateGrades(): void {
    this.modelSettingsForm.patchValue({
      Grades: this.numGrades,
    });
  }

  private setRequiredValidator(controlName: string) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }
}
