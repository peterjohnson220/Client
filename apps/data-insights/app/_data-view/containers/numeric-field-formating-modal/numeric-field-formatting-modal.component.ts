import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Field } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as cloneDeep from 'lodash.clonedeep';

import { FieldFormatType } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-numeric-field-formatting-modal',
  templateUrl: './numeric-field-formatting-modal.component.html',
  styleUrls: ['./numeric-field-formatting-modal.component.scss']
})
export class NumericFieldFormattingModalComponent {
  @Output() saveClicked: EventEmitter<Field> = new EventEmitter<Field>();
  @ViewChild('numericFieldFormatModal', { static: false }) public numericFieldFormatModal: any;

  field: Field;
  decimals: number;
  numberFormat: string;
  value: number;

  constructor(
    private modalService: NgbModal
  ) { }

  open(field, format): void {
    this.modalService.open(this.numericFieldFormatModal, {backdrop: 'static', centered: true});
    this.field = cloneDeep(field);
    if (!!format) {
      const parsedFormat = format.charAt(2);
      this.decimals = parseInt(parsedFormat, 0);
      this.value = this.decimals;
    }
  }

  close(): void {
    this.decimals = 0;
    this.value = 0;
    this.modalService.dismissAll();
  }

  save(): void {
    this.numberFormat = `1.${this.decimals}-${this.decimals}`;
    this.field.Format = this.numberFormat;
    this.field.FormatType = FieldFormatType.Number;
    this.saveClicked.emit(this.field);
    this.decimals = 0;
    this.value = 0;
    this.modalService.dismissAll();
  }

  handleNumericValueChange(value: number) {
    this.decimals = value;
  }
}
