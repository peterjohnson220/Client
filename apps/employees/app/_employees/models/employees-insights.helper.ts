import { CompanyEmployee, GenericKeyValue } from 'libs/models';
import { EmployeeBenefit } from 'libs/models/payfactors-api';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EmployeeInsights } from 'libs/models/payfactors-api/employees/employee-insights.model';

export interface EmployeeDetailsField {
  Name: string;
  SourceName: string;
  Type?: string;
}

export enum EmployeeDetailSections {
  EmployeeInformation = 'Employee_Information',
  JobInformation = 'Job_Information',
  ComponentsOfPay = 'Components_of_Pay',
  Allowances = 'Allowances',
  Incentives = 'Incentives',
}

export enum EmployeeFieldDataType {
  Bit = 'bit',
  DateTime = 'dateTime',
  Int = 'int',
  Float = 'float',
  String = 'string',
  LongString = 'longString',
  Binary = 'binary',
  Unknown = 'unknown'
}


export class EmployeesInsightsHelper {
  private static decimalPipe: DecimalPipe = new DecimalPipe('en-US');
  private static datePipe: DatePipe = new DatePipe('en-US');

  static employeeInformation: EmployeeDetailsField[] = [
    {
      Name: 'Employee ID',
      SourceName: 'CompanyEmployeeId'
    },
    {
      Name: 'Email Address',
      SourceName: 'EmailAddress'
    },
    {
      Name: 'First Name',
      SourceName: 'FirstName'
    },
    {
      Name: 'Work City',
      SourceName: 'WorkCity'
    },
    {
      Name: 'Last Name',
      SourceName: 'LastName'
    },
    {
      Name: 'Work State',
      SourceName: 'WorkState'
    },
    {
      Name: 'Date of Birth',
      SourceName: 'DateOfBirth',
      Type: EmployeeFieldDataType.DateTime
    },
    {
      Name: 'Work Zip',
      SourceName: 'Zip'
    },
    {
      Name: 'Gender',
      SourceName: 'Gender'
    },
    {
      Name: 'Work Country',
      SourceName: 'WorkCountry'
    },
    {
      Name: 'Ethnicity',
      SourceName: 'EthnicityPF'
    }
    ];

  static jobInformation: EmployeeDetailsField[] = [
    {
      Name: 'Job Title',
      SourceName: 'JobTitle'
    },
    {
      Name: 'Job Code',
      SourceName: 'JobCode'
    },
    {
      Name: 'Manager ID',
      SourceName: 'ManagerEmployeeId'
    },
    {
      Name: 'Currency Code',
      SourceName: 'CurrencyCode'
    },
    {
      Name: 'Status',
      SourceName: 'EmployeeStatus'
    },
    {
      Name: 'Facility',
      SourceName: 'Facility'
    },
    {
      Name: 'Date of Hire',
      SourceName: 'DateOfHire',
      Type: EmployeeFieldDataType.DateTime
    }
  ];

  static componentsOfPay: EmployeeDetailsField[] = [
    {
      Name: 'Rate',
      SourceName: 'Rate'
    },
    {
      Name: 'Total Guaranteed Pay',
      SourceName: 'TGP',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'PayMarket',
      SourceName: 'PayMarket'
    },
    {
      Name: 'Total Remuneration',
      SourceName: 'Remun',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Base Salary',
      SourceName: 'BaseSalary',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Department',
      SourceName: 'Department'
    },
    {
      Name: 'STI',
      SourceName: 'STI',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Bonus Percentage',
      SourceName: 'BonusPct',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Bonus',
      SourceName: 'Bonus',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Bonus Target Percentage',
      SourceName: 'BonusTargetPct',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Bonus Target',
      SourceName: 'BonusTarget',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'TCC',
      SourceName: 'TCC',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'FTE',
      SourceName: 'FTE',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'TDC',
      SourceName: 'TDC',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Target LTIP',
      SourceName: 'TargetLTIP',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Target TCC',
      SourceName: 'TargetTCC',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Target TDC',
      SourceName: 'TargetTDC',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Total Fixed Pay',
      SourceName: 'Fixed',
      Type: EmployeeFieldDataType.Float
    }
  ];

  static allowances: EmployeeDetailsField[] = [
    {
      Name: 'Allowances',
      SourceName: 'Allow',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Meals Allowance',
      SourceName: 'MealsAllowance',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Housing Allowances',
      SourceName: 'HousingAllowance',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Flex Allowance',
      SourceName: 'FlexAllowance',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Transportation Allowance',
      SourceName: 'TransportationAllowance',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Leave Allowance',
      SourceName: 'LeaveAllowance',
      Type: EmployeeFieldDataType.Float
    }
  ];

  static incentives: EmployeeDetailsField[] = [
    {
      Name: 'LTI Eligibility',
      SourceName: 'LTIElig',
      Type: EmployeeFieldDataType.Bit
    },
    {
      Name: 'LTI',
      SourceName: 'LTI',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Stock Appreciation Right (SAR) - Number Granted',
      SourceName: 'SARNumGranted',
      Type: EmployeeFieldDataType.Float
    },
    {
      Name: 'Stock Appreciation Right (SAR) - Price at Grant',
      SourceName: 'SARPriceatGrant',
      Type: EmployeeFieldDataType.Float
    }
  ];

  static mapEmployeeDataToGenericKeyValues(employeeInsights: EmployeeInsights, section: string): GenericKeyValue<string, string>[] {
    const results: GenericKeyValue<string, string>[] = [];
    switch (section) {
      case EmployeeDetailSections.EmployeeInformation:
        this.employeeInformation.forEach(f => {
          results.push({
            Key: f.Name,
            Value: this.convertValue(employeeInsights.Employee, f)
          });
        });
        break;
      case EmployeeDetailSections.JobInformation:
        this.jobInformation.forEach(f => {
          if (f.SourceName === 'CurrencyCode' && employeeInsights.CurrencyName) {
            results.push({
              Key: f.Name,
              Value: employeeInsights.Employee[f.SourceName] + ' - ' + employeeInsights.CurrencyName
            });
          } else {
            results.push({
              Key: f.Name,
              Value: this.convertValue(employeeInsights.Employee, f)
            });
          }
        });
        break;
        case EmployeeDetailSections.ComponentsOfPay:
          this.componentsOfPay.forEach(f => {
            results.push({
              Key: f.Name,
              Value: this.convertValue(employeeInsights.Employee, f)
            });
          });
        break;
      case EmployeeDetailSections.Allowances:
        this.allowances.forEach(f => {
          results.push({
            Key: f.Name,
            Value: this.convertValue(employeeInsights.Employee, f)
          });
        });
        break;
        case EmployeeDetailSections.Incentives:
          this.incentives.forEach(f => {
            results.push({
              Key: f.Name,
              Value: this.convertValue(employeeInsights.Employee, f)
            });
          });
          break;
      default:
      return;
    }
    return results;
  }

  static mapEmployeeBenefitsDataToGenericKeyValues(benefit: EmployeeBenefit[]): GenericKeyValue<string, string>[] {
    const results: GenericKeyValue<string, string>[] = [];
    benefit.forEach(f => {
      results.push({
        Key: f.DisplayName,
        Value: this.decimalPipe.transform(f.EmployerValue, '1.2-2')
      });
    });
    return results;
  }

  static getCustomFieldsWithValues(employeeInsights: EmployeeInsights, udfFields: GenericKeyValue<string, string>[]): GenericKeyValue<string, string>[] {
    let results: GenericKeyValue<string, string>[] = [];
    udfFields.forEach(f => {
      results.push({
        Key: f.Value,
        Value: employeeInsights.Employee[f.Key]
      });
    });
    results = results.filter(x => !!x.Value);
    return results;
  }

  static convertValue(employee: CompanyEmployee, field: EmployeeDetailsField) {
    switch (field.Type) {
      case EmployeeFieldDataType.Float:
        return this.decimalPipe.transform(employee[field.SourceName], '1.2-2');
      case EmployeeFieldDataType.DateTime:
        const sourceDate = new Date(employee[field.SourceName]);
        return this.datePipe.transform(sourceDate, 'MM-dd-YYYY');
      case EmployeeFieldDataType.Bit:
        return employee[field.SourceName] === 'true' ? 'Y' : 'N';
      default:
        return employee[field.SourceName];
    }
  }
}
