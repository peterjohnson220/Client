import { PagingOptions } from '../../search';

export interface GetCompanySurveysRequest {
  PagingOptions: PagingOptions;
  Query: string;
}
