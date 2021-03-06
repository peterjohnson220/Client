import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Permissions } from 'libs/constants';
import { RangeGroupMetadata } from 'libs/models/structures';
import { RangeType } from 'libs/constants/structures/range-type';

import * as fromSharedStructuresReducer from '../../../shared/reducers';

@Component({
  selector: 'pf-global-actions',
  templateUrl: './global-actions.component.html',
  styleUrls: ['./global-actions.component.scss']
})
export class GlobalActionsComponent implements OnInit {
  @Input() metadata: RangeGroupMetadata;
  @Input() isNewModel = false;
  @Output() addJobsClicked = new EventEmitter();
  @Output() publishModelClicked = new EventEmitter();
  @Output() modelSettingsClicked = new EventEmitter();
  @Output() duplicateModelClicked = new EventEmitter();
  @Output() compareModelClicked = new EventEmitter();
  @Output() manageModelClicked = new EventEmitter();

  _Permissions = null;
  comparing$: Observable<boolean>;
  compareEnabled$: Observable<boolean>;
  isJobRange: boolean;

  constructor(
    private store: Store<fromSharedStructuresReducer.State>
  ) {
    this._Permissions = Permissions;
    this.comparing$ = this.store.select(fromSharedStructuresReducer.getComparingModels);
    this.compareEnabled$ = this.store.select(fromSharedStructuresReducer.getCompareEnabled);
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

  handleManageJobsClicked() {
    this.manageModelClicked.emit();
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

  ngOnInit(): void {
    this.isJobRange = this.metadata.RangeTypeId === RangeType.Job;
  }

  isPublishButtonDisabled() {
    return this.metadata.PayType === null;
  }
}
