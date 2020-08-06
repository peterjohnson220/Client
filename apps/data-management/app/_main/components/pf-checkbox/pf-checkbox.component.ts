import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pf-checkbox',
  templateUrl: './pf-checkbox.component.html',
  styleUrls: ['./pf-checkbox.component.scss']
})
export class PfCheckboxComponent {

  @Input() isChecked = false;
  @Input() DisplayText = 'DisplayText';
  @Input() isDisabled = false;
  @Input() ToolTip = '';
  @Input() QADataId: string = null;

  @Output() valueChange = new EventEmitter();

  constructor() { }

  valueChanged() {
    if (!this.isDisabled) {
      this.valueChange.emit(!this.isChecked);
    }
  }

}
