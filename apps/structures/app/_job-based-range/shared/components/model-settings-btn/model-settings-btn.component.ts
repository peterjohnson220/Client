import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';

import * as fromSharedJobBasedRangeReducer from '../../reducers';

@Component({
  selector: 'pf-model-settings-btn',
  templateUrl: 'model-settings-btn.component.html',
  styleUrls: ['./model-settings-btn.component.scss']
})
export class ModelSettingsBtnComponent {
  @ViewChild('p') public p: any;

  @Input() metadata: RangeGroupMetadata;
  @Output() modelSettingsClicked = new EventEmitter();
  @Output() duplicateModelClicked = new EventEmitter();
  @Output() compareModelClicked = new EventEmitter();

  compareEnabled$: Observable<boolean>;
  comparingFlag$: Observable<boolean>;

  constructor(
    private store: Store<fromSharedJobBasedRangeReducer.State>
  ) {
    this.compareEnabled$ = this.store.select(fromSharedJobBasedRangeReducer.getCompareEnabled);
    this.comparingFlag$ = this.store.select(fromSharedJobBasedRangeReducer.getComparingModels);
  }

  showModelSettings() {
    this.modelSettingsClicked.emit();
    this.p.close();
  }

  showDuplicateModel() {
    this.duplicateModelClicked.emit();
    this.p.close();
  }

  compareWithCurrent() {
    this.compareModelClicked.emit();
    this.p.close();
  }

  getToolTipContent(enabled: boolean) {
    if (enabled) {
      return null;
    }
    return 'To compare this model it must have the same pay type and range type as the current published model.';
  }

}
