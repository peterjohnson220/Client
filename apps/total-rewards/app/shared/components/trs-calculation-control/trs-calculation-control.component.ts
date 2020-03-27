import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

import {CalculationControl} from '../../models';
import {CompensationField} from '../../models/compensation-field';
import {UpdateTitleRequest} from '../../models/request-models/update-title-request';
import {UpdateFieldOverrideNameRequest} from '../../models/request-models/update-field-override-name-request';
import {UpdateFieldVisibilityRequest} from '../../models/request-models/update-field-visibility-request';

// import {UpdateCalculationControlRequest} from '../../models/request-models/update-calculction-control-request';

@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsCalculationControlComponent implements OnInit, OnChanges {

  @Input() controlData: CalculationControl;
  @Input() employeeData: any;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldTitleChange: EventEmitter<UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onUpdateSummaryTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldRemoved: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCompFieldAdded: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();

  removedFields: CompensationField[];

  compensationValuePlaceholder = '$---,---';

  constructor(public cp: CurrencyPipe) {
  }

  ngOnInit() {
    this.removedFields = this.controlData.DataFields.filter(f => f.IsVisible === false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.controlData) {
      this.removedFields = this.controlData.DataFields.filter(f => f.IsVisible === false);
    }
  }

  removeField(field: CompensationField) {
    this.onCompFieldRemoved.emit({ControlId: this.controlData.Id, DataFieldId: field.Id, IsVisible: false});
  }

  addField(event: any) {
    const fieldToAdd = this.removedFields.find(f => f.DefaultName === event.target.text);
    this.onCompFieldAdded.emit({ControlId: this.controlData.Id, DataFieldId: fieldToAdd.Id, IsVisible: true});
  }

  onCompFieldNameChange(field: CompensationField, name: string) {
    this.onCompFieldTitleChange.emit({ControlId: this.controlData.Id, NewName: name, DataFieldId: field.Id});
  }

  onControlTitleChange(newTitle: string) {
    this.onTitleChange.emit({ControlId: this.controlData.Id, Title: newTitle});
  }

  onSummaryTitleChange(summaryTitle: string) {
    this.onUpdateSummaryTitleChange.emit({ControlId: this.controlData.Id, Title: summaryTitle});
  }

  getEmployerContributionValue(field: string) {
    if (this.employeeData && this.employeeData.compensationData && this.employeeData.compensationData.length) {
      if (this.employeeData.compensationData.find(c => c.category === field)) {
        return this.cp.transform(this.employeeData.compensationData.find(c => c.category === field).value, 'USD', 'symbol-narrow', '1.0');
      }
    }
    return this.compensationValuePlaceholder;
  }

  getSummaryValue() {
    if (this.employeeData && this.employeeData.compensationData && this.employeeData.compensationData.length) {
      let fieldsToSum = [];
      let sum = 0;
      if (this.employeeData.compensationData) {
        fieldsToSum = this.employeeData.compensationData.filter(d => this.controlData.DataFields.some(c => c.DatabaseField === d.category));
        for (let f = 0; f < fieldsToSum.length; f++) {
          sum += fieldsToSum[f].value;
        }
        return this.cp.transform(sum, 'USD', 'symbol-narrow', '1.0');
      }
    }

    return this.compensationValuePlaceholder;
  }

}
