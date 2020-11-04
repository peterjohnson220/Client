import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { MissingMarketDataTypes } from 'libs/constants/structures/missing-market-data-type';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromJobBasedRangeReducer from '../../reducers';
import { AdvancedModelingHelper } from '../../helpers/advanced-modeling.helper';


@Component({
  selector: 'pf-advanced-modeling',
  templateUrl: './advanced-modeling.component.html',
  styleUrls: ['./advanced-modeling.component.scss']
})
export class AdvancedModelingComponent implements OnInit, OnDestroy {
  @Input() advancedSettingForm: FormGroup;
  @Input() attemptedSubmit: true;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  metadata: RangeGroupMetadata;
  disableAdvancedSetting: boolean;
  hasPublishedSub: Subscription;

  private formPreventMidsFromIncreasingMoreThanPercentEnabled = 'RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Enabled';
  private formPreventMidsFromIncreasingMoreThanPercentPercentage = 'RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Percentage';
  private formMissingMarketDataTypeType = 'RangeAdvancedSetting.MissingMarketDataType.Type';
  private formMissingMarketDataTypePercentage = 'RangeAdvancedSetting.MissingMarketDataType.Percentage';

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.hasPublishedSub = this.store.select(fromSharedJobBasedRangeReducer.getStructureHasPublished).subscribe( hp => {
      if (hp.obj > 0) {
        this.disableAdvancedSetting = false;
      } else {
        this.disableAdvancedSetting = true;
      }
    });
  }

  getMissingMarketDataTypeValue(value: string): number {
    return AdvancedModelingHelper.setMissingMarketDataTypeValue(value);
  }

  get preventMidsFromIncreasingMoreThanPercentEnabled() {
    return this.advancedSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentEnabled);
  }

  get preventMidsFromIncreasingMoreThanPercentPercentage() {
    return this.advancedSettingForm.get(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
  }

  get missingMarketDataTypeType() {
    return this.advancedSettingForm.get(this.formMissingMarketDataTypeType);
  }

  get missingMarketDataTypePercentage() {
    return this.advancedSettingForm.get(this.formMissingMarketDataTypePercentage);
  }

  get missingMarketDataTypesIncreaseCurrentByPercent() {
    return MissingMarketDataTypes.IncreaseCurrentByPercent;
  }

  handlePreventMidsFromIncreasingMoreThanPercentChanged(event: any) {
    if (event.target.checked) {
      this.setValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage, 0.01, 100);
    } else {
      this.clearValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
    }
  }

  handleRadioButtonChanged(event: any) {
    if (event.target.id === 'IncreaseCurrentByPercent') {
      this.setValidators(this.formMissingMarketDataTypePercentage, 0, 100);
    } else {
      this.clearValidators(this.formMissingMarketDataTypePercentage);
    }
  }

  private setValidators(controlName: string, min: number, max: number) {
    this.advancedSettingForm.get(controlName).enable();
    this.advancedSettingForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.advancedSettingForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
    this.advancedSettingForm.get(controlName).disable();
    this.advancedSettingForm.get(controlName).clearValidators();
    this.advancedSettingForm.get(controlName).updateValueAndValidity();
  }

  // Lifecycle
  ngOnInit(): void {
    this.metadataSub = this.metaData$.subscribe(md => {
      this.metadata = md;
    });

    if (this.preventMidsFromIncreasingMoreThanPercentEnabled.value) {
      this.setValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage, 0.01, 100);
    } else {
      this.clearValidators(this.formPreventMidsFromIncreasingMoreThanPercentPercentage);
    }

    if (+this.missingMarketDataTypeType.value === MissingMarketDataTypes.IncreaseCurrentByPercent) {
      this.setValidators(this.formMissingMarketDataTypePercentage, 0, 100);
    } else {
      this.clearValidators(this.formMissingMarketDataTypePercentage);
    }
  }

  ngOnDestroy(): void {
    this.metadataSub.unsubscribe();
    this.hasPublishedSub.unsubscribe();
  }
}
