import { Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { Field } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as cloneDeep from 'lodash.clonedeep';

import { FieldFormatType } from 'libs/models/payfactors-api';
import { dateFormatCasing } from '../../helpers/date-format-casing.helper';

@Component({
  selector: 'pf-date-field-formatting-modal',
  templateUrl: './date-field-formatting-modal.component.html',
  styleUrls: ['./date-field-formatting-modal.component.scss']
})
export class DateFieldFormattingModalComponent {
  @Output() saveClicked: EventEmitter<Field> = new EventEmitter<Field>();
  @ViewChild('dateFieldFormatModal', { static: false }) public dateFieldFormatModal: any;

  field: Field;
  selectedValue: string;
  dateFormats = ['MM/DD/YYYY', 'M/D/YY', 'M/D/YYYY', 'DD/MM/YYYY'];

  constructor(
    private modalService: NgbModal
  ) { }

  open(field, format): void {
    this.modalService.open(this.dateFieldFormatModal, {backdrop: 'static', centered: true});
    this.field = cloneDeep(field);
    this.selectedValue = !!format ? format.toUpperCase() : this.dateFormats[0];
  }

  close(): void {
    this.modalService.dismissAll();
  }

  save(): void {
    this.field.Format = dateFormatCasing[this.selectedValue];
    this.field.FormatType = FieldFormatType.Date;
    this.saveClicked.emit(this.field);
    this.modalService.dismissAll();
  }

  handleDateValueChanged(value: string) {
    this.selectedValue = value;
  }

}
