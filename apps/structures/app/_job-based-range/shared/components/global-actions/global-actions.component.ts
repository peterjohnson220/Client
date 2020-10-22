import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Permissions } from 'libs/constants';
import { RangeGroupMetadata } from 'libs/models/structures';

import * as fromSharedJobBasedRangeReducer from '../../reducers';

@Component({
  selector: 'pf-global-actions',
  templateUrl: './global-actions.component.html',
  styleUrls: ['./global-actions.component.scss']
})
export class GlobalActionsComponent {
  @Input() metadata: RangeGroupMetadata;
  @Output() addJobsClicked = new EventEmitter();
  @Output() publishModelClicked = new EventEmitter();
  @Output() modelSettingsClicked = new EventEmitter();
  @Output() duplicateModelClicked = new EventEmitter();
  @Output() compareModelClicked = new EventEmitter();

  _Permissions = null;
  comparing$: Observable<boolean>;
  compareEnabled$: Observable<boolean>;

  constructor(
    private store: Store<fromSharedJobBasedRangeReducer.State>
  ) {
    this._Permissions = Permissions;
    this.comparing$ = this.store.select(fromSharedJobBasedRangeReducer.getComparingModels);
    this.compareEnabled$ = this.store.select(fromSharedJobBasedRangeReducer.getCompareEnabled);

  }

  handleAddJobsClicked() {
    this.addJobsClicked.emit();
  }

  handlePublishModelClicked() {
    this.publishModelClicked.emit();
  }

  handleModelSettingsClicked() {
    this.modelSettingsClicked.emit();
  }

  handleDuplicateModelClicked() {
    this.duplicateModelClicked.emit();
  }

  compareWithCurrent() {
    this.compareModelClicked.emit();
  }

  getToolTipContent(enabled: boolean) {
    if (enabled) {
      return null;
    }
    return 'To compare this model it must have the same pay type and range type as the current published model.';
  }

}
