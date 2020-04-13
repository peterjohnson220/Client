import { BaseSearchAggregationsRequest, BaseStructuresSearchRequest } from '../..';

export interface JobSearchStructuresAggregationRequest extends BaseStructuresSearchRequest, BaseSearchAggregationsRequest {
    SearchField: string;
    TextQuery: string;
    AggregateCount?: number;
    Type: string;
}
