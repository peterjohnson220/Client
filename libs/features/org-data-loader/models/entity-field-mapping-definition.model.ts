import { LoaderType } from 'libs/features/org-data-loader/constants';
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
        break;
      case LoaderType.Jobs:
        return {
          fieldMappingDefinitionModel: getJobsCustomDictionary()
        };
        break;
      case LoaderType.Structures:
        return {
          fieldMappingDefinitionModel: getStructuresCustomDictionary()
        };
        break;
      case LoaderType.StructureMapping:
        return {
          fieldMappingDefinitionModel: getStructureMappingsCustomDictionary()
        };
        break;
      case LoaderType.Employees:
        return {
          fieldMappingDefinitionModel: getEmployeesCustomDictionary()
        };
        break;
    }
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

export function getJobsCustomDictionary(): GenericKeyValue<string, string>[] {
  const jobsCustomDictionary: GenericKeyValue<string, string>[] = [];
  return jobsCustomDictionary;
}

export function getStructuresCustomDictionary(): GenericKeyValue<string, string>[] {
  const structuresCustomDictionary: GenericKeyValue<string, string>[] = [];
  return structuresCustomDictionary;
}

export function getStructureMappingsCustomDictionary(): GenericKeyValue<string, string>[] {
  const structureMappingsCustomDictionary: GenericKeyValue<string, string>[] = [];
  return structureMappingsCustomDictionary;
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
