import { JobDescriptionLibraryResult } from './job-description-library-result.model';

export class JobDescriptionLibraryBucket {
  Key: string;
  Label: string;
  DocumentCount: number;
  AvailableSources: string[];
  Results: JobDescriptionLibraryResult[];
}

export function createMockJobDescriptionLibraryBucket(): JobDescriptionLibraryBucket {
  return {
    Key: 'summary',
    Label: 'Summary',
    DocumentCount: 3,
    AvailableSources: [
      'PayFactors',
      'Mercer',
      'Hewitt Associates',
      'Radford',
      'Towers Watson',
      'Gartner Inc.',
      'Sullivan, Cotter & Associates',
      'Western Management Group',
      'Life Office Management Assoc',
      'D.Dietrich Associates, Inc.'],
    Results: [
      {
        'JobTitle': 'Test 1',
        'Highlights': ['Test highlights'],
        'Source': 'Altman Weil Publications, Inc.',
        'Content': 'Test Content',
        'ShowFull': false,
        'SourceDetail': {
          'Identifier1': 'Altman Weil Publications, Inc.',
          'Identifier2': 'Law Department Compensation Benchmarking Survey',
          'Identifier3': '03/01/2010 00:00:00'
        }
      },
      {
        'JobTitle': 'Test 2',
        'Highlights': ['Test highlights'],
        'Source': 'American Medical Group',
        'Content': 'Test Content',
        'ShowFull': false,
        'SourceDetail': {
          'Identifier1': 'American Medical Group',
          'Identifier2': 'Medical Group Compensation & Financial Survey',
          'Identifier3': '01/01/2010 00:00:00'
        }
      },
      {
        'JobTitle': 'Test 3',
        'Highlights': ['Test highlights'],
        'Source': 'Western Management Group',
        'Content': 'Test Content',
        'ShowFull': false,
        'SourceDetail': {
          'Identifier1': 'Western Management Group',
          'Identifier2': 'Western Management Group Survey',
          'Identifier3': '01/01/2010 00:00:00'
        }
      },
    ]
  };
}

