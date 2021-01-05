import { JobDescriptionLibraryResult } from './job-description-library-result.model';

export class JobDescriptionLibraryBucket {
  Key: string;
  Label: string;
  DocumentCount: number;
  AvailableSources: string[];
  Results: JobDescriptionLibraryResult[];
}
