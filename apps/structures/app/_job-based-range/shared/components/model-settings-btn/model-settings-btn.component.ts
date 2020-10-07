import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { RangeGroupMetadata } from '../../models';

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

  constructor() {}

  showModelSettings() {
    this.modelSettingsClicked.emit();
    this.p.close();
  }

  showDuplicateModel() {
    this.duplicateModelClicked.emit();
    this.p.close();
  }
}
