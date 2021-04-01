import { Injectable } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { Statement, CalculationControl, CompensationField, TotalRewardsControlEnum } from '../models';
import { CurrentControlIndexResponse } from '../models/current-control-index-response';

@Injectable()
export class TotalRewardsStatementService {
  static getCurrentControlIndex(statement: Statement, controlId: string): CurrentControlIndexResponse {
    for (let p = 0; p < statement.Pages.length; p++) {
      const page = statement.Pages[p];
      for (let s = 0; s < page.Sections.length; s++) {
        const section = page.Sections[s];
        for (let c = 0; c < section.Columns.length; c++) {
          const column = section.Columns[c];
          for (let cc = 0; cc < column.Controls.length; cc++) {
            if (column.Controls[cc].Id === controlId) {
              return {
                Page : p,
                Section : s,
                Column : c,
                Control : cc
              };
            }
          }
        }
      }
    }
  }

  static getVisibleCalculationFields (statement: Statement): CompensationField[] {
    const dataFieldsList: CompensationField[] = [];
    for (let p = 0; p < statement.Pages.length; p++) {
      const page = statement.Pages[p];
      for (let s = 0; s < page.Sections.length; s++) {
        const section = page.Sections[s];
        for (let c = 0; c < section.Columns.length; c++) {
          const column = section.Columns[c];
          for (let cc = 0; cc < column.Controls.length; cc++) {
            if (column.Controls[cc].ControlType === TotalRewardsControlEnum.Calculation) {
              const calcControl = column.Controls[cc] as CalculationControl;
              calcControl.DataFields.forEach(field => {
                if (field.IsVisible) {
                  dataFieldsList.push(field);
                }
              });
            }
          }
        }
      }
    }
    return dataFieldsList;
  }

  static getStatementUdfFields(statement: Statement): CompensationField[] {
    const udfFields: CompensationField[] = [];
    for (let p = 0; p < statement.Pages.length; p++) {
      const page = statement.Pages[p];
      for (let s = 0; s < page.Sections.length; s++) {
        const section = page.Sections[s];
        for (let c = 0; c < section.Columns.length; c++) {
          const column = section.Columns[c];
          for (let cc = 0; cc < column.Controls.length; cc++) {
            if (column.Controls[cc].ControlType === TotalRewardsControlEnum.Calculation) {
              const calcControl = column.Controls[cc] as CalculationControl;
              calcControl.DataFields.forEach((field, fieldIndex) => {
                if (field.Type) {
                  udfFields.push({
                      ...field,
                      FieldIndex: fieldIndex,
                      ControlIndex: {
                        Page : p,
                        Section : s,
                        Column : c,
                        Control : cc
                      }
                    });
                  }
              });
            }
          }
        }
      }
    }
    return udfFields;
  }

  static syncUdfFields(statement: Statement, statementUdfFields: CompensationField[], companyUdfs: CompensationField[]): void {
    if (!statementUdfFields?.length) {
      return;
    }
    statementUdfFields.forEach(field => {
      const control = statement
        .Pages[field.ControlIndex.Page]
        .Sections[field.ControlIndex.Section]
        .Columns[field.ControlIndex.Column]
        .Controls[field.ControlIndex.Control] as CalculationControl;
      const controlUdfField = control.DataFields[field.FieldIndex];
      const companyUdfField = companyUdfs.find(f => f.Id === controlUdfField.Id);
      if (companyUdfField) {
        companyUdfField.IsVisible = true;
        controlUdfField.Name.Default = companyUdfField.Name.Default;
      } else {
        controlUdfField.IsVisible = false;
      }
    });
  }

  static sumCalculationControlEmployerContribution(control: CalculationControl, employeeRewardsData: EmployeeRewardsData): number {
    let sum = 0;
    const visibleFields = control.DataFields.filter(f => f.IsVisible);
    visibleFields.forEach(df => {
      if (df.Type) {
        const fieldValue = TotalRewardsStatementService.getUdfAsNumeric(employeeRewardsData, df.Type, df.DatabaseField);
        sum += isNaN(fieldValue) ? 0 : fieldValue;
      } else if (this.doesBenefitFieldHaveData(df.DatabaseField, employeeRewardsData, false)) {
        sum += employeeRewardsData.BenefitsData[df.DatabaseField].EmployerValue;
      } else if (this.doesEmployeeRewardsFieldHaveData(df.DatabaseField, employeeRewardsData)) {
        sum += employeeRewardsData[df.DatabaseField];
      }
    });
    return sum;
  }

  static sumCalculationControlEmployeeContribution(control: CalculationControl, employeeRewardsData: EmployeeRewardsData): number {
    let sum = 0;
    const visibleFields = control.DataFields.filter(f => f.IsVisible && f.CanHaveEmployeeContribution);
    visibleFields.forEach(df => {
      if (this.doesBenefitFieldHaveData(df.DatabaseField, employeeRewardsData, true)) {
        sum += employeeRewardsData.BenefitsData[df.DatabaseField].CompanyEmployeeValue;
      }
    });
    return sum;
  }

  static sumCalculationControls(controls: CalculationControl[], employeeRewardsData: EmployeeRewardsData): number {
    let sum = 0;
    controls.forEach(calculationControl => {
      sum += TotalRewardsStatementService.sumCalculationControlEmployerContribution(calculationControl, employeeRewardsData);
    });
    return sum;
  }

  static applyFuncToEachControl(statement: Statement, functionToCallWithControl: Function): void {
    statement?.Pages?.forEach(
      p => p.Sections?.forEach(
        s => s.Columns?.forEach(
          c => c.Controls?.forEach(
            cc => {
              functionToCallWithControl(cc);
            }
          )
        )
      )
    );
  }

  static doesEmployeeRewardsFieldHaveData(fieldName: string, employeeRewardsData: EmployeeRewardsData): boolean {
    if (!employeeRewardsData) {
      return false;
    }
    return employeeRewardsData[fieldName] > 0;
  }

  static doesBenefitFieldHaveData(fieldName: string, employeeRewardsData: EmployeeRewardsData, shouldCheckEmployeeContribution: boolean): boolean {
    if (!employeeRewardsData) {
      return false;
    }

    if (!this.doesBenefitsDataExist(employeeRewardsData)) {
      return false;
    }
    const fieldExistInBenefitsData = employeeRewardsData.BenefitsData[fieldName] !== undefined && employeeRewardsData.BenefitsData[fieldName] != null;
    const fieldHasEmployerValue = fieldExistInBenefitsData && employeeRewardsData.BenefitsData[fieldName].EmployerValue > 0;
    const fieldHasEmployeeValue = fieldExistInBenefitsData && employeeRewardsData.BenefitsData[fieldName].CompanyEmployeeValue > 0;
    return fieldHasEmployerValue || (shouldCheckEmployeeContribution && fieldHasEmployeeValue);
  }

  static doesBenefitsDataExist(employeeRewardsData: EmployeeRewardsData): boolean {
    return employeeRewardsData?.BenefitsData !== null && employeeRewardsData?.BenefitsData !== undefined;
  }

  static parseStatementEffectiveDateToString(statement: Statement): Statement {
    const statementCopy = cloneDeep(statement);
    statementCopy.EffectiveDate = this.effectiveDateDateToString(statement.EffectiveDate);
    return statementCopy;
  }

  static effectiveDateDateToString(date: Date): string {
    return date === null ? '' : date.toDateString();
  }

  // in calc controls this should be called to attempt coercing UDF values such as `$1000` to 1000; in RTEs these same fields are inserted verbatim
  static getUdfAsNumeric(employeeRewards: EmployeeRewardsData, udfType: 'EmployeesUdf' | 'JobsUdf', key: string): number | typeof NaN {
    const rawFieldValue = employeeRewards[udfType][key];
    if (typeof rawFieldValue === 'number') { return rawFieldValue; }
    if (typeof rawFieldValue === 'string') { return +(rawFieldValue.replace('$', '').replace(',', '')); }
    return NaN;
  }
}
