import { SortDirection } from './index';

export interface LibrarySearchRequest {
  BucketKey: string;
  JobTitle: string;
  Keyword: string;
  PageSize: number;
  PageNumber: number;
  JobDescriptionId: number;
  Sources: string;
  SourceSortDirection?: SortDirection;
}
