import { Injectable } from '@angular/core';

import { EmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';

import { Statement, CalculationControl, CompensationField, TotalRewardsControlEnum } from '../models';
import { CurrentControlIndexResponse } from '../models/current-control-index-response';
import { TrsConstants } from '../constants/trs-constants';

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

  static sumCalculationControl(control: CalculationControl, employeeRewardsData: EmployeeRewardsData): number {
    let sum = 0;
    const visibleFields = control.DataFields.filter(f => f.IsVisible);
    visibleFields.forEach(df => {
      if (!!df.Type) {
        const fieldValue = employeeRewardsData.IsMockData
          ? TrsConstants.UDF_DEFAULT_VALUE
          : employeeRewardsData[df.Type][df.DatabaseField] > 0 ? employeeRewardsData[df.Type][df.DatabaseField] : 0;
        sum += fieldValue;
      } else {
        sum += employeeRewardsData[df.DatabaseField];
      }
    });
    return sum;
  }

  static sumCalculationControls(controls: CalculationControl[], employeeRewardsData: EmployeeRewardsData): number {
    let sum = 0;
    controls.forEach(calculationControl => {
      sum += TotalRewardsStatementService.sumCalculationControl(calculationControl, employeeRewardsData);
    });
    return sum;
  }
}
