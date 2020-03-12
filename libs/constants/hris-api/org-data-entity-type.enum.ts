export enum OrgDataEntityType {
  Employees = 'Employees',
  JobDescriptions = 'JobDescriptions',
  Jobs = 'Jobs',
  PayMarkets = 'PayMarkets',
  Structures = 'Structures',
  StructureMappings = 'StructureMappings',
}

export function getOrgDataEntityTypeDisplayName(entity: OrgDataEntityType) {
  let name: string;

  switch(entity) {
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
    case OrgDataEntityType.StructureMappings:
      name = 'Structure Mappings';
      break;
    case OrgDataEntityType.Structures:
      name = 'Structures';
      break;
    default:
      throw new Error(`Unknown entity type ${entity}`);
  }

  return name;
}
