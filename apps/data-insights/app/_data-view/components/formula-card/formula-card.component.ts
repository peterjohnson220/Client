import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Field } from '../../../_main/models';

@Component({
  selector: 'pf-user-formula-card',
  templateUrl: './formula-card.component.html',
  styleUrls: ['./formula-card.component.scss']
})
export class FormulaCardComponent {
  @Input() field: Field;
  @Output() editFormulaClicked = new EventEmitter<Field>();
  @Output() deleteClicked = new EventEmitter<Field>();

  constructor() { }

  handleEditFormulaClick(field: Field): void {
    this.editFormulaClicked.emit(field);
  }

  handleDeleteFormulaClick(field: Field): void {
    this.deleteClicked.emit(field);
  }
}
