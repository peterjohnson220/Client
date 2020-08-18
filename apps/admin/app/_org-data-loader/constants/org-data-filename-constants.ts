import { OrgDataFilenamePatternSet } from '../models';

export const enum FilenamePatternStartsWithConvention {
  PayMarkets = 'paymarkets',
  Jobs = 'jobs',
  Structures = 'structures',
  StructureMapping = 'structuremapping',
  Employees = 'employees',
  Subsidiaries = 'subsidiaries'
}

export const enum LoaderSettingsFilenamePatternOverrideKey {
  PayMarkets = 'PaymarketsFilenamePatternOverride',
  Jobs = 'JobsFilenamePatternOverride',
  Structures = 'StructuresFilenamePatternOverride',
  StructureMapping = 'StructureMappingsFilenamePatternOverride',
  Employees = 'EmployeesFilenamePatternOverride',
  Subsidiaries = 'SubsidiariesFilenamePatternOverride'
}

export const OrgDataFilenamePatternSetConvention: OrgDataFilenamePatternSet = {
  EmployeesFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.Employees
  },
  JobsFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.Jobs
  },
  PayMarketsFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.PayMarkets
  },
  StructureMappingsFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.StructureMapping
  },
  StructuresFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.Structures
  },
  SubsidiaryFilenamePattern: {
    IsStartWithRestricted: true,
    Name: FilenamePatternStartsWithConvention.Subsidiaries
  }
};
