import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromJobBasedRangeReducer from '../../reducers';
import { RangeGroupMetadata } from '../../models';
import { Pages } from '../../constants/pages';
import { AdvancedModelingHelper } from '../../helpers/advanced-modeling.helper';

@Component({
  selector: 'pf-advanced-modeling',
  templateUrl: './advanced-modeling.component.html',
  styleUrls: ['./advanced-modeling.component.scss']
})
export class AdvancedModelingComponent implements OnInit, OnDestroy {
  @Input() rangeGroupId: number;
  @Input() page: Pages;
  @Input() advancedSettingForm: FormGroup;
  @Input() attemptedSubmit: true;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;
  metadata: RangeGroupMetadata;

  constructor(public store: Store<fromJobBasedRangeReducer.State>) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
  }

  getMissingMarketDataTypeValue(value: string): number {
    return AdvancedModelingHelper.setMissingMarketDataTypeValue(value);
  }

  get preventMidsFromIncreasingMoreThanPercentEnabled() {
    return this.advancedSettingForm.get('RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Enabled');
  }

  get preventMidsFromIncreasingMoreThanPercentPercentage() {
    return this.advancedSettingForm.get('RangeAdvancedSetting.PreventMidsFromIncreasingMoreThanPercent.Percentage');
  }

  // Lifecycle
  ngOnInit(): void {
    this.metadataSub = this.metaData$.subscribe(md => {
      this.metadata = md;
    });

    this.togglePercentValidation(this.preventMidsFromIncreasingMoreThanPercentEnabled.value);
  }

  handlePreventMidsFromIncreasingMoreThanPercentChanged(event: any) {
    this.togglePercentValidation(event.target.checked);
  }

  private togglePercentValidation(percentEnabled: boolean) {
    if (percentEnabled) {
      this.preventMidsFromIncreasingMoreThanPercentPercentage.enable();
      this.preventMidsFromIncreasingMoreThanPercentPercentage.setValidators([Validators.required, Validators.min(0.1), Validators.max(100)]);
    } else {
      this.preventMidsFromIncreasingMoreThanPercentPercentage.disable();
      this.preventMidsFromIncreasingMoreThanPercentPercentage.clearValidators();
    }
    this.preventMidsFromIncreasingMoreThanPercentPercentage.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.metadataSub.unsubscribe();
  }
}
