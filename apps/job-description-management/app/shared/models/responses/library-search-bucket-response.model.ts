import { JobDescriptionLibraryBucket } from '../job-description-library-bucket.model';

export interface LibrarySearchBucketResponse {
  buckets: JobDescriptionLibraryBucket[];
  selectedBucket: string;
}
