import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RangeGroupMetadata } from '../../models';

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

  constructor() {}

  handleAddJobsClicked() {
    this.addJobsClicked.emit();
  }

  handlePublishModelClicked() {
    this.publishModelClicked.emit();
  }

  handleModelSettingsClicked() {
    this.modelSettingsClicked.emit();
  }
}
