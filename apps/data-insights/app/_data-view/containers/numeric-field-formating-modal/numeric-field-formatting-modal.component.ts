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
  @ViewChild('numericFieldFormatModal') public numericFieldFormatModal: any;

  field: Field;
  decimals: number;
  selectedFormatType: FieldFormatType;
  formatTypes = FieldFormatType;

  constructor(
    private modalService: NgbModal
  ) { }

  open(field: Field): void {
    this.modalService.open(this.numericFieldFormatModal, {backdrop: 'static', centered: true});
    this.field = cloneDeep(field);
    this.selectedFormatType = FieldFormatType.Number;
    this.decimals = 0;
    if (!!this.field.FieldFormat.Format) {
      const parsedFormat = this.field.FieldFormat.Format.charAt(2);
      this.decimals = parseInt(parsedFormat, 0);
      this.selectedFormatType = this.field.FieldFormat.Type;
    }
  }

  close(): void {
    this.decimals = 0;
    this.modalService.dismissAll();
  }

  save(): void {
    const digitsInfo = `1.${this.decimals}-${this.decimals}`;
    const kendoFormat = this.selectedFormatType === FieldFormatType.Percent ? `p${this.decimals}` : `n${this.decimals}`;
    this.field.FieldFormat = {
      Value: `${this.selectedFormatType}:${digitsInfo}`,
      Type: this.selectedFormatType,
      Format: digitsInfo,
      KendoNumericFormat: kendoFormat
    };
    this.saveClicked.emit(this.field);
    this.close();
  }
}
