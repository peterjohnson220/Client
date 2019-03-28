import { CompanyJobMapping } from 'libs/models/peer';

export interface LoadAssociations {
  CompanyJobMappings: CompanyJobMapping[];
  ExpandedDetailRowId: number;
}
