import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RangeGroupMetadata } from "../../models";

@Component({
  selector: 'pf-model-settings-btn',
  templateUrl: 'model-settings-btn.component.html'
})
export class ModelSettingsBtnComponent {
  @Input() metadata: RangeGroupMetadata;
  @Output() clicked = new EventEmitter();

  constructor() {}
}
