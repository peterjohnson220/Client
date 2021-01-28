import { LoaderType } from 'libs/features/loaders/org-data-loader/constants';
import { GenericKeyValue } from 'libs/models';

export interface EntityFieldMappingDefinitionModel {
  fieldMappingDefinitionModel: GenericKeyValue<string, string>[];
}

export function getEntityFieldMappingDefinition(loaderType: LoaderType) {
  switch (loaderType) {
    case LoaderType.PayMarkets:
      return {
        fieldMappingDefinitionModel: getPaymarketsCustomDictionary()
      };
    case LoaderType.Structures:
      return {
        fieldMappingDefinitionModel: getStructuresCustomDictionary()
      };
    case LoaderType.Employees:
      return {
        fieldMappingDefinitionModel: getEmployeesCustomDictionary()
      };
    case LoaderType.Benefits:
      return {
        fieldMappingDefinitionModel: getBenefitsCustomDictionary()
      };
    default:
      return {
        fieldMappingDefinitionModel: getEmptyDictionary()
      };
  }
}

export function getEmptyDictionary(): GenericKeyValue<string, string>[] {
  const emptyDictionary: GenericKeyValue<string, string>[] = [];
  return emptyDictionary;
}

export function getPaymarketsCustomDictionary(): GenericKeyValue<string, string>[] {
  const paymarketsCustomDictionary: GenericKeyValue<string, string>[] = [
    {
      Key: 'Linked_AdjPct',
      Value: 'Adjustment'
    }
  ];
  return paymarketsCustomDictionary;
}

export function getStructuresCustomDictionary(): GenericKeyValue<string, string>[] {
  const structuresCustomDictionary: GenericKeyValue<string, string>[] = [
    {
      Key: 'Tertile_First',
      Value: 'Top 1st 3rd'
    },
    {
      Key: 'Tertile_Second',
      Value: 'Top 2nd 3rd'
    },
    {
      Key: 'Quartile_First',
      Value: 'Top 1st 4th'
    },
    {
      Key: 'Quartile_Second',
      Value: 'Top 3rd 4th'
    },
    {
      Key: 'Quintile_First',
      Value: 'Top 1st 5th'
    },
    {
      Key: 'Quintile_Second',
      Value: 'Top 2nd 5th'
    },
    {
      Key: 'Quintile_Third',
      Value: 'Top 3rd 5th'
    },
    {
      Key: 'Quintile_Fourth',
      Value: 'Top 4th 5th'
    },
    {
      Key: 'RangeDistributionType',
      Value: 'RangeDistributionType'
    }
  ];
  return structuresCustomDictionary;
}

export function getEmployeesCustomDictionary(): GenericKeyValue<string, string>[] {
  const employeesCustomDictionary: GenericKeyValue<string, string>[] = [
    {
      Key: 'Zip',
      Value: 'Work Zip'
    },
    {
      Key: 'Country',
      Value: 'CountryCode'
    },
    {
      Key: 'Employee_Status',
      Value: 'Status'
    },
    {
      Key: 'Base',
      Value: 'Salary'
    },
    {
      Key: 'STIElig',
      Value: 'STI Eligibility'
    },
    {
      Key: 'LTIElig',
      Value: 'LTI Eligibility'
    }
  ];
  return employeesCustomDictionary;
}

export function getBenefitsCustomDictionary(): GenericKeyValue<string, string>[] {
  const benefitsCustomDictionary: GenericKeyValue<string, string>[] = [
    {
      Key: 'Employer_Value',
      Value: 'Company Contribution'
    },
    {
      Key: 'CompanyEmployee_Value',
      Value: 'Employee Contribution'
    }
  ];
  return benefitsCustomDictionary;
}
