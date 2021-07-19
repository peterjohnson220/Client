import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { delay } from 'rxjs/operators';

import { RangeGroupMetadata } from 'libs/models';
import { AdjustMidpointTypes } from 'libs/constants/structures/adjust-midpoint-type';

import * as fromSharedStructuresReducer from '../../reducers';
import * as fromModelSettingsModalActions from '../../actions/model-settings-modal.actions';
import { GradeBasedModelSettingsContentComponent } from './grade-based-model-settings-content';

@Component({
  selector: 'pf-grade-based-model-settings-modal',
  templateUrl: './grade-based-model-settings-modal.component.html'
})
export class GradeBasedModelSettingsModalComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() isNewModel = true;

  @ViewChild(GradeBasedModelSettingsContentComponent, { static: false }) public modelContentComponent: GradeBasedModelSettingsContentComponent;

  modalOpen$: Observable<boolean>;
  metaData$: Observable<RangeGroupMetadata>;
  gradeDetails$: Observable<any>;

  metaData: RangeGroupMetadata;
  controlPoint: string;
  numGrades: number;

  modelSettingsForm: FormGroup;

  metaDataSub: Subscription;
  gradesDetailsSub: Subscription;

  constructor(
    public sharedStore: Store<fromSharedStructuresReducer.State>
  ) {
    this.modalOpen$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getGradeModelSettingsModalOpen), delay(0));
    this.metaData$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.gradeDetails$ = this.sharedStore.pipe(select(fromSharedStructuresReducer.getGradesDetails));
  }

  ngOnInit(): void {
    this.metaDataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metaData = md;
        this.controlPoint = this.metaData?.PayType ? this.metaData.PayType + 'MRP' : 'BaseMRP';
      }
    });
    this.gradesDetailsSub = this.gradeDetails$.subscribe(details => {
      if (details?.obj?.length > 0) {
        this.numGrades = details.obj.length;
      }

      this.buildForm();
    });
  }

  handleModalSubmit() {
    this.modelContentComponent.handleModalSubmit();
  }

  handleModelAttemptedSubmit() {
    this.modelContentComponent.handleModalSubmitAttempt();
  }

  handleModalDismissed() {
    this.modelContentComponent.handleModalDismiss();
  }

  handleAdjustMidpointRadioButtonChanged(event: any) {
    this.clearValidators('AdjustMidpointSetting.Percentage');
    if (event.target.id === 'AdjustMidpointMoveBy') {
      this.setValidators('AdjustMidpointSetting.Percentage', 0.01, 300);
    }
  }

  private buildForm(): void  {
    this.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl(!this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'Grades': new FormControl(this.numGrades || ''),
      'RangeDistributionTypeId': new FormControl({ value: this.metaData.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'MarketDataBased': new FormControl(this.controlPoint || 'BaseMRP', [Validators.required]),
      'StartingMidpoint': new FormControl(this.metaData.StartingMidpoint || ''),
      'RangeSpread': new FormControl(this.metaData.SpreadMin || ''),
      'MidpointProgression': new FormControl(this.metaData.MidpointProgression || ''),
      'Rate': new FormControl(this.metaData.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metaData.Currency || 'USD', [Validators.required]),
      'AdjustMidpointSetting': new FormGroup({
        'Type': new FormControl(AdjustMidpointTypes.NoChange),
        'Percentage': new FormControl({ value: '', disabled: true })
      })
    });

    if (!this.metaData.IsCurrent) {
      this.setRequiredValidator('RangeSpread');
      this.setRequiredValidator('MidpointProgression');
    }

    this.sharedStore.dispatch(new fromModelSettingsModalActions.SetActiveTab('modelTab'));
  }

  private setRequiredValidator(controlName: string) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private setValidators(controlName: string, min: number, max: number) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
    this.modelSettingsForm.get(controlName).disable();
    this.modelSettingsForm.get(controlName).clearValidators();
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.metaDataSub.unsubscribe();
    this.gradesDetailsSub.unsubscribe();
  }
}
