import { EmployeeModalSectionEnum } from '../models';
import { EmployeeModalSectionModel } from '../models/employee-modal-section.model';

export const sectionFieldsMap: Record<string, EmployeeModalSectionModel> = {
  'EmployeeInformationSection' :
    {
      sectionEnum : EmployeeModalSectionEnum.EmployeeInformationSection,
      fieldNames : ['EmployeeId', 'FirstName', 'LastName', 'EmailAddress', 'City', 'State', 'Zip', 'Country', 'DOB', 'EthnicityPF'],
      employeeValidationFields : ['EmployeeId']
    },
  'JobInformationSection' :
    {
      sectionEnum : EmployeeModalSectionEnum.JobInformationSection,
      fieldNames : ['CompanyJobId', 'CurrencyCode', 'Facility', 'ManagerEmployeeId', 'EmployeeStatus', 'DOH'],
      employeeValidationFields : ['CompanyJobId', 'ManagerEmployeeId']
    },
  'ComponentsOfPaySection' :
    {
      sectionEnum : EmployeeModalSectionEnum.ComponentsOfPaySection,
      fieldNames : ['Rate', 'CompanyPayMarketId', 'Base', 'STI', 'Bonus', 'BonusTarget', 'FTE', 'TargetLTIP', 'TargetTDC', 'TGP',
        'Remun', 'Department', 'BonusPct', 'BonusTargetPct', 'TCC', 'TDC', 'TargetTCC', 'Fixed'],
      employeeValidationFields : ['Department']
    },
  'AllowancesSection' :
    {
      sectionEnum : EmployeeModalSectionEnum.AllowancesSection,
      fieldNames : ['Allow', 'HousingAllowance', 'TransportationAllowance', 'MealsAllowance', 'FlexAllowance',
        'LeaveAllowance', 'OtherAllowance', 'CarAllowanceEligibility', 'CarAllowanceAmount'],
      employeeValidationFields : []
    },
  'IncentivesSection' :
    {
      sectionEnum : EmployeeModalSectionEnum.IncentivesSection,
      fieldNames : ['LTI', 'PerformanceStockNumGranted', 'PerformanceStockPriceatGrant', 'SARNumGranted', 'SARPriceatGrant',
        'RSUNumGranted', 'RSUPriceatGrant'],
      employeeValidationFields : []
    }
};
