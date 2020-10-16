import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Permissions } from 'libs/constants';

import { RangeGroupMetadata } from '../../models';
import * as fromSharedJobBasedRangeReducer from '../../reducers';


@Component({
  selector: 'pf-global-actions',
  templateUrl: './global-actions.component.html',
  styleUrls: ['./global-actions.component.scss']
})
export class GlobalActionsComponent {
  @Input() metadata: RangeGroupMetadata;
  @Input() currentRangeGroupId: number;
  @Output() addJobsClicked = new EventEmitter();
  @Output() publishModelClicked = new EventEmitter();
  @Output() modelSettingsClicked = new EventEmitter();
  @Output() duplicateModelClicked = new EventEmitter();
  @Output() compareModelClicked = new EventEmitter();

  _Permissions = null;
  comparing$: Observable<boolean>;

  constructor(
    private store: Store<fromSharedJobBasedRangeReducer.State>
  ) {
    this._Permissions = Permissions;
    this.comparing$ = this.store.select(fromSharedJobBasedRangeReducer.getComparingModels);
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

  handleCompareModelClicked() {
    this.compareModelClicked.emit();
  }
}
