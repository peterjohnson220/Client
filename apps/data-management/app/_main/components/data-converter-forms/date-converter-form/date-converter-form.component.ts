import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConverterSettings } from 'libs/models';


@Component({
  selector: 'pf-date-converter-form',
  templateUrl: './date-converter-form.component.html',
  styleUrls: ['./date-converter-form.component.scss']
})
export class DateConverterFormComponent {

  @Input() fieldName: string;
  @Input() provider: string;
  @Input() dataType: string;
  @Input() entityType: string;
  @Input() selectedDateFormat: string;

  @Output() onDateConverterFormCancel = new EventEmitter();
  @Output() onDateConverterFormSave = new EventEmitter<ConverterSettings>();

  private converterOption: ConverterSettings;

  constructor() {

  }

  onDateFormatSelected(event) {
    const converterOption: ConverterSettings = {
      dataType: this.dataType,
      entityType: this.entityType,
      fieldName: this.fieldName,
      options: {
        DateTimeFormat: event
      }
    };
    this.converterOption = converterOption;
  }

  cancelClick() {
    this.onDateConverterFormCancel.emit();
  }

  saveClick() {
    this.onDateConverterFormSave.emit(this.converterOption);
  }
}
