import { SourceDetail } from './source-detail.model';

export class JobDescriptionLibraryResult {
  JobTitle: string;
  Source: string;
  Content: string;
  ShowFull: boolean;
  Highlights: string[];
  SourceDetail: SourceDetail;
}
