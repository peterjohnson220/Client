import { AddRemoveCompanyJobStructureMapModel } from 'libs/features/structures/add-jobs-to-range/models';

export interface SaveCompanyJobStructureMapsRequest {
  GradesToUpdate: AddRemoveCompanyJobStructureMapModel[];
  StructuresRangeGroupId: number;
}
