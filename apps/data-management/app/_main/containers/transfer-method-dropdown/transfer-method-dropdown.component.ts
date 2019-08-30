import { Component, Input, EventEmitter, Output } from '@angular/core';

import { TransferMethod } from '../../models';

@Component({
  selector: 'pf-transfer-method-dropdown',
  templateUrl: './transfer-method-dropdown.component.html',
  styleUrls: ['./transfer-method-dropdown.component.scss']
})
export class TransferMethodDropdownComponent {

  private previousValue: number;

  @Input() transferMethods: TransferMethod[];
  @Output() transferMethodSelected = new EventEmitter();

  constructor() { }

  transferMethodChanged(event: any) {
    if (event.target.value) {
      this.previousValue = event.target.value;
      this.transferMethodSelected.emit(event.target.value);
    }
  }
}
