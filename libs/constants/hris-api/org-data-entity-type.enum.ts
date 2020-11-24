export enum OrgDataEntityType {
  Employees = 'Employees',
  JobDescriptions = 'JobDescriptions',
  Jobs = 'Jobs',
  PayMarkets = 'PayMarkets',
  Structures = 'Structures',
  StructureMapping = 'StructureMapping',
  Subsidiaries = 'Subsidiaries',
  Benefits = 'Benefits',
  EmployeeTags = 'EmployeeTags'
}

export function getOrgDataEntityTypeDisplayName(entity: OrgDataEntityType) {
  let name: string;

  switch (entity) {
    case OrgDataEntityType.Employees:
      name = 'Employees';
      break;
    case OrgDataEntityType.JobDescriptions:
      name = 'Job Descriptions';
      break;
    case OrgDataEntityType.Jobs:
      name = 'Jobs';
      break;
    case OrgDataEntityType.PayMarkets:
      name = 'PayMarkets';
      break;
    case OrgDataEntityType.StructureMapping:
      name = 'Structure Mappings';
      break;
    case OrgDataEntityType.Structures:
      name = 'Structures';
      break;
    case OrgDataEntityType.Subsidiaries:
      name = 'Subsidiaries';
      break;
    case OrgDataEntityType.Benefits:
      name = 'Benefits';
      break;
    case OrgDataEntityType.EmployeeTags:
      name = 'EmployeeTags';
      break;
    default:
      throw new Error(`Unknown entity type ${entity}`);
  }

  return name;
}
