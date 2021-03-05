import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { StripHtmlPipe } from 'libs/core/pipes';
import { createMockJobDescriptionLibraryBucket, LibrarySearchRequest, SortDirection } from 'libs/features/jobs/job-description-management';
import { JobDescriptionLibraryComponent } from './jobs-description-library.component';


describe('Job Description Library Component', () => {
  let fixture: ComponentFixture<JobDescriptionLibraryComponent>;
  let instance: JobDescriptionLibraryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobDescriptionLibraryComponent, StripHtmlPipe
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(JobDescriptionLibraryComponent);
    instance = fixture.componentInstance;
    instance.activeBucket = createMockJobDescriptionLibraryBucket();
    instance.keyword = '';
    instance.pageSize = 10;
    instance.pageNumber = 1;
    instance.jobTitleSearch = 'Test';
    instance.selectedSources = [];
    instance.sourceSortDirection = SortDirection.Descending;
  });

  it('should sort on source upon handleSourceSortChange', () => {
    spyOn(instance.searchChanged, 'emit');
    instance.handleSourceSortChange();

    const searchRequest: LibrarySearchRequest = {
      BucketKey: 'summary',
      Keyword: '',
      PageSize: 10,
      PageNumber: 1,
      JobTitle: 'Test',
      JobDescriptionId: null,
      Sources: JSON.stringify([]),
      SourceSortDirection: SortDirection.Ascending
    };

    expect(instance.searchChanged.emit).toHaveBeenCalledWith(searchRequest);
  });


  it('should filter on source upon handleSourceChange', () => {
    spyOn(instance.searchChanged, 'emit');
    instance.handleSourceChange('Altman Weil Publications, Inc.');

    const searchRequest: LibrarySearchRequest = {
      BucketKey: 'summary',
      Keyword: '',
      PageSize: 10,
      PageNumber: 1,
      JobTitle: 'Test',
      JobDescriptionId: null,
      Sources: JSON.stringify('Altman Weil Publications, Inc.'),
      SourceSortDirection: SortDirection.Descending
    };

    expect(instance.searchChanged.emit).toHaveBeenCalledWith(searchRequest);
  });
});
