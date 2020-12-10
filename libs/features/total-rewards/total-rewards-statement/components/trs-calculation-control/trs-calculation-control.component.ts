import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnChanges,
  Output, SimpleChanges
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import cloneDeep from 'lodash/cloneDeep';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import * as models from '../../models';
import { TotalRewardsStatementService } from '../../services/total-rewards-statement.service';
import { CompensationField, SelectableFieldsGroup } from '../../models';
import { FieldLayout } from '../../models/settings';
import { TrsConstants } from '../../constants/trs-constants';

@Component({
  selector: 'pf-trs-calculation-control',
  templateUrl: './trs-calculation-control.component.html',
  styleUrls: ['./trs-calculation-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrsCalculationControlComponent implements OnChanges {

  @Input() controlData: models.CalculationControl;
  @Input() employeeRewardsData: EmployeeRewardsData;
  @Input() mode: models.StatementModeEnum;
  @Input() companyUdfs: CompensationField[];
  @Input() visibleFieldsCount: number;
  @Input() graphicsColors: string[];

  @Output() onTitleChange: EventEmitter<models.UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldTitleChange: EventEmitter<models.UpdateFieldOverrideNameRequest> = new EventEmitter();
  @Output() onUpdateSummaryTitleChange: EventEmitter<models.UpdateTitleRequest> = new EventEmitter();
  @Output() onCompFieldRemoved: EventEmitter<models.UpdateFieldVisibilityRequest> = new EventEmitter();
  @Output() onCompFieldAdded: EventEmitter<models.UpdateFieldVisibilityRequest> = new EventEmitter();

  selectableFields: CompensationField[];
  maxVisibleFieldsReached = false;
  consolidated = FieldLayout.Consolidated;
  private readonly MAX_VISIBLE_FIELDS = 20;

  constructor(public currencyPipe: CurrencyPipe) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.companyUdfs?.currentValue?.length || changes?.controlData?.currentValue?.DataFields?.length) {
      this.selectableFields = this.buildSelectableFieldsList();
      this.maxVisibleFieldsReached = this.visibleFieldsCount === this.MAX_VISIBLE_FIELDS;
    }
  }

  get inEditMode(): boolean {
    return this.mode === models.StatementModeEnum.Edit;
  }

  get inPreviewMode(): boolean {
    return this.mode === models.StatementModeEnum.Preview;
  }

  get removedFields(): models.CompensationField[] {
    return this.controlData.DataFields.filter(f => f.IsVisible === false);
  }

  removeField(field: models.CompensationField) {
    this.onCompFieldRemoved.emit({ControlId: this.controlData.Id, DataFieldId: field.Id, IsVisible: false});
  }

  addField(event: any) {
    const fieldToAdd = this.selectableFields.find(f => f.Name.Default === event.Name.Default);
    if (fieldToAdd) {
      this.onCompFieldAdded.emit({
        ControlId: this.controlData.Id, DataFieldId: fieldToAdd.Id, IsVisible: true, Type: fieldToAdd.Type
      });
    }
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

  getEmployerContributionValue(field: models.CompensationField) {
    if (this.employeeRewardsData && (this.mode !== models.StatementModeEnum.Edit)) {
      if (!field.Type && this.employeeRewardsData[field.DatabaseField] || this.employeeRewardsData[field.DatabaseField] === 0) {
        return this.currencyPipe.transform(this.employeeRewardsData[field.DatabaseField], this.employeeRewardsData?.Currency, 'symbol-narrow', '1.0');
      }
      if (field.Type) {
        const fieldValue = this.employeeRewardsData.IsMockData
          ? TrsConstants.UDF_DEFAULT_VALUE
          : this.employeeRewardsData[field.Type][field.DatabaseField];
        return this.currencyPipe.transform(fieldValue, this.employeeRewardsData?.Currency, 'symbol-narrow', '1.0');
      }
    }

    return '';
  }

  getSummaryValue() {
    if (this.employeeRewardsData && (this.mode !== models.StatementModeEnum.Edit)) {
      const sum = TotalRewardsStatementService.sumCalculationControl(this.controlData, this.employeeRewardsData);
      return this.currencyPipe.transform(sum, this.employeeRewardsData?.Currency, 'symbol-narrow', '1.0');
    }

    return '';
  }

  displayFieldInTable(compField: models.CompensationField): boolean {
    if (compField.Type) {
      return this.isUdfFieldVisible(compField);
    } else {
      return this.isBenefitsFieldVisible(compField);
    }
  }

  private buildSelectableFieldsList(): models.CompensationField[] {
    let filteredBenefitsFields: CompensationField[];
    let filteredEmployeeUdfs: CompensationField[];
    let filteredJobUdfs: CompensationField[];

    filteredBenefitsFields = this.filterSelectableFields(this.controlData?.DataFields?.length, SelectableFieldsGroup.BenefitFields);
    filteredEmployeeUdfs = this.filterSelectableFields(this.companyUdfs?.filter(f => f.Type === 'EmployeesUdf').length, SelectableFieldsGroup.EmployeesUdf);
    filteredJobUdfs = this.filterSelectableFields(this.companyUdfs?.filter(f => f.Type === 'JobsUdf').length, SelectableFieldsGroup.JobsUdf);

    return filteredBenefitsFields.concat(filteredEmployeeUdfs).concat(filteredJobUdfs);
  }

  private filterSelectableFields(fieldsLength: number, group: string): models.CompensationField[] {
    let filteredFieldsList: CompensationField[] = [];
    if (fieldsLength) {
      switch (group) {
        case SelectableFieldsGroup.BenefitFields:
          filteredFieldsList = cloneDeep(this.controlData.DataFields).filter(f => f.IsVisible === false);
          filteredFieldsList.forEach(f => { f.Group = group; f.DisplayName = f.Name.Override ?? f.Name.Default; });
          break;
        case SelectableFieldsGroup.EmployeesUdf:
          filteredFieldsList = cloneDeep(this.companyUdfs).filter(f => f.IsVisible === false && f.Type === 'EmployeesUdf');
          filteredFieldsList.forEach(f => { f.Group = group; f.DisplayName = f.Name.Override ?? f.Name.Default; });
          break;
        case SelectableFieldsGroup.JobsUdf:
          filteredFieldsList = cloneDeep(this.companyUdfs).filter(f => f.IsVisible === false && f.Type === 'JobsUdf');
          filteredFieldsList.forEach(f => { f.Group = group; f.DisplayName = f.Name.Override ?? f.Name.Default; });
          break;
        default:
          return [];
      }
    }
    return filteredFieldsList;
  }

  private isUdfFieldVisible(field: models.CompensationField): boolean {
    if (this.inEditMode) {
      return true;
    }
    if (this.employeeRewardsData.IsMockData) {
      return field.IsVisible;
    }
    return field.IsVisible && this.employeeRewardsData[field.Type][field.DatabaseField] > 0;
  }

  private isBenefitsFieldVisible(field: models.CompensationField): boolean {
    if (this.inEditMode) {
      return field.IsVisible;
    }
    return field.IsVisible && this.employeeRewardsData[field.DatabaseField] > 0;
  }
}
