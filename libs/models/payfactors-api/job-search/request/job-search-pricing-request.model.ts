import { JobSearchContext } from '../job-search-aggregation-type';

export interface JobSearchPricingDataRequest {
  PayfactorsJobCode?: string;
  CompanyJobId?: number;
  Type: JobSearchContext;
  Rate?: string;
}

export interface StructuresJobSearchPricingDataRequest extends JobSearchPricingDataRequest {
  StructureRangeGroupId: number;
}

export interface ProjectJobSearchPricingDataRequest extends JobSearchPricingDataRequest {
  ProjectId: number;
}

