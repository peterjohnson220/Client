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
import { CurrencyPipe } from '@angular/common';

import {
  CalculationControl,
  CompensationField,
  UpdateTitleRequest,
  UpdateFieldOverrideNameRequest,
  UpdateFieldVisibilityRequest,
  EmployeeRewardsData,
  StatementModeEnum
} from '../../models';


@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsCalculationControlComponent implements OnInit, OnChanges {

  @Input() controlData: CalculationControl;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() mode: StatementModeEnum;

  @Output() onTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldTitleChange: EventEmitter<UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onUpdateSummaryTitleChange: EventEmitter<UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldRemoved: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCompFieldAdded: EventEmitter<UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() controlSum: EventEmitter<number> = new EventEmitter();

  removedFields: CompensationField[] = this.getRemovedFields();
  inEditMode: boolean;

  compensationValuePlaceholder = '$---,---';

  constructor(public cp: CurrencyPipe) {
  }

  ngOnInit() {
    this.inEditMode = (this.mode === StatementModeEnum.Edit);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.controlData) {
      this.removedFields = this.controlData.DataFields.filter(f => f.IsVisible === false);
    }
    if (changes.mode) {
      this.inEditMode = (this.mode === StatementModeEnum.Edit);
    }
  }

  removeField(field: CompensationField) {
    this.onCompFieldRemoved.emit({ControlId: this.controlData.Id, DataFieldId: field.Id, IsVisible: false});
  }

  addField(event: any) {
    const fieldToAdd = this.removedFields.find(f => f.Name.Default === event.target.text);
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
    if (this.employeeRewardsData && (this.mode !== StatementModeEnum.Edit)) {
      if (this.employeeRewardsData[field] || this.employeeRewardsData[field] === 0) {
        return this.cp.transform(this.employeeRewardsData[field], 'USD', 'symbol-narrow', '1.0');
      }
    }
    return this.compensationValuePlaceholder;
  }

  getSummaryValue() {
    if (this.employeeRewardsData && (this.mode !== StatementModeEnum.Edit)) {
      const fieldsToSum = this.controlData.DataFields.filter(d => d.IsVisible === true);
      let sum = 0;
      for (let f = 0; f < fieldsToSum.length; f++) {
        sum += this.employeeRewardsData[fieldsToSum[f].DatabaseField];
      }
      this.controlSum.emit(sum);
      return this.cp.transform(sum, 'USD', 'symbol-narrow', '1.0');
    }

    return this.compensationValuePlaceholder;
  }

  getRemovedFields(): CompensationField[] {
    if (this.controlData && this.controlData.DataFields) {
      return this.controlData.DataFields.filter(df => df.IsVisible === false);
    } else {
      return [];
    }
  }

  displayFieldInTable(compField: CompensationField): boolean {
    if (compField.IsVisible) {
      if (this.inEditMode) {
        return true;
      }
      return this.employeeRewardsData[ compField.DatabaseField ] !== null;
    }
    return false;
  }
}
