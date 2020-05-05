import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import * as models from '../../models';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';

@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsCalculationControlComponent {

  @Input() controlData: models.CalculationControl;
  @Input() employeeRewardsData: models.EmployeeRewardsData;
  @Input() mode: models.StatementModeEnum;

  @Output() onTitleChange: EventEmitter<models.UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldTitleChange: EventEmitter<models.UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onUpdateSummaryTitleChange: EventEmitter<models.UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldRemoved: EventEmitter<models.UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCompFieldAdded: EventEmitter<models.UpdateFieldVisibilityRequest> = new EventEmitter();

  compensationValuePlaceholder = '$---,---';

  get inEditMode(): boolean {
    return this.mode === models.StatementModeEnum.Edit;
  }

  get removedFields(): models.CompensationField[] {
    return this.controlData.DataFields.filter(f => f.IsVisible === false);
  }

  constructor(public cp: CurrencyPipe) { }

  removeField(field: models.CompensationField) {
    this.onCompFieldRemoved.emit({ControlId: this.controlData.Id, DataFieldId: field.Id, IsVisible: false});
  }

  addField(event: any) {
    const fieldToAdd = this.removedFields.find(f => f.Name.Default === event.target.text);
    this.onCompFieldAdded.emit({ControlId: this.controlData.Id, DataFieldId: fieldToAdd.Id, IsVisible: true});
  }

  onCompFieldNameChange(field: models.CompensationField, name: string) {
    this.onCompFieldTitleChange.emit({ControlId: this.controlData.Id, NewName: name, DataFieldId: field.Id});
  }

  onControlTitleChange(newTitle: string) {
    this.onTitleChange.emit({ControlId: this.controlData.Id, Title: newTitle});
  }

  onSummaryTitleChange(summaryTitle: string) {
    this.onUpdateSummaryTitleChange.emit({ControlId: this.controlData.Id, Title: summaryTitle});
  }

  getEmployerContributionValue(field: string) {
    if (this.employeeRewardsData && (this.mode !== models.StatementModeEnum.Edit)) {
      if (this.employeeRewardsData[field] || this.employeeRewardsData[field] === 0) {
        return this.cp.transform(this.employeeRewardsData[field], 'USD', 'symbol-narrow', '1.0');
      }
    }
    return this.compensationValuePlaceholder;
  }

  getSummaryValue() {
    if (this.employeeRewardsData && (this.mode !== models.StatementModeEnum.Edit)) {
      const sum = TotalRewardsStatementService.sumCalculationControl(this.controlData, this.employeeRewardsData);
      return this.cp.transform(sum, 'USD', 'symbol-narrow', '1.0');
    }

    return this.compensationValuePlaceholder;
  }

  getRemovedFields(): models.CompensationField[] {
    if (this.controlData && this.controlData.DataFields) {
      return this.controlData.DataFields.filter(df => df.IsVisible === false);
    } else {
      return [];
    }
  }

  displayFieldInTable(compField: models.CompensationField): boolean {
    if (compField.IsVisible) {
      if (this.inEditMode) {
        return true;
      }
      return this.employeeRewardsData[compField.DatabaseField] !== null;
    }
    return false;
  }
}
