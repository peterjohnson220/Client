import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConverterSettings } from 'libs/models';

import { ValueMapping } from '../../../models';


@Component({
  selector: 'pf-converter-form',
  templateUrl: './converter-form.component.html',
  styleUrls: ['./converter-form.component.scss']
})
export class ConverterFormComponent {

  @Input() fieldName: string;
  @Input() provider: string;
  @Input() dataType: string;
  @Input() entityType: string;
  @Input() fieldValues: ValueMapping[];

  @Output() onConverterFormCancel = new EventEmitter();
  @Output() onConverterFormSave = new EventEmitter<ConverterSettings>();

  @ViewChild('translateDataForm') translateDataForm: NgForm;

  private converterOption: ConverterSettings;

  constructor() {

  }


  cancelClick() {
    this.onConverterFormCancel.emit();
  }

  saveClick() {
    const converterOption: ConverterSettings = {
      dataType: this.dataType,
      entityType: this.entityType,
      fieldName: this.fieldName,
      options: {
        MappingValues: this.formatFieldReplacements(),
      }
    };
    this.converterOption = converterOption;

    this.onConverterFormSave.emit(this.converterOption);
  }

  formatFieldReplacements() {
    return this.fieldValues.map(field => ({
      PayfactorsName: field['PayfactorsName'],
      ClientValues: field['ClientValues'].toString().split(',').map(item => item.trim())
    }));
  }
}
