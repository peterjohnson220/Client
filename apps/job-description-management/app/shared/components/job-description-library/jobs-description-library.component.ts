import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as cloneDeep from 'lodash.clonedeep';

import { StripHtmlPipe } from 'libs/core/pipes';

import { LibrarySearchRequest, JobDescriptionLibraryResult, JobDescriptionLibraryBucket } from '../../models';

@Component({
  selector: 'pf-job-description-library',
  templateUrl: './job-description-library.component.html',
  styleUrls: ['./job-description-library.component.scss']
})
export class JobDescriptionLibraryComponent implements OnChanges {
  @Input() jobTitle: string;
  @Input() buckets: JobDescriptionLibraryBucket[];
  @Input() results: JobDescriptionLibraryResult[];
  @Input() loadingBuckets: boolean;
  @Output() searchChanged = new EventEmitter<LibrarySearchRequest>();
  @Output() tabChanged = new EventEmitter<LibrarySearchRequest>();
  @Output() pageChanged = new EventEmitter<LibrarySearchRequest>();
  @Output() closed = new EventEmitter();

  activeBucket: JobDescriptionLibraryBucket;
  pageSize = 10;
  pageNumber = 1;
  jobLibraryResults: JobDescriptionLibraryResult[] = [];
  keyword = '';
  jobTitleSearch = '';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  close() {
    this.closed.emit(true);
  }

  // Events
  handleJobTitleChange(value: any) {
    this.jobTitleSearch = value;
    this.searchChanged.emit(this.buildSearchRequest());
  }

  handleKeywordChange(value: any) {
    this.keyword = value;
    this.searchChanged.emit(this.buildSearchRequest());
  }

  handlePageChange(pageChangeObj: any) {
    this.pageNumber = pageChangeObj;
    this.pageChanged.emit(this.buildSearchRequest());
  }

  handleTabChange(bucketKey: string) {
    this.activeBucket = this.buckets.find(x => x.Key === bucketKey);
    this.pageNumber = 1;
    this.tabChanged.emit(this.buildSearchRequest());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.buckets && this.buckets.length) {
      if (this.activeBucket) {
        this.activeBucket = this.buckets.find( x => x.Key === this.activeBucket.Key);
      } else {
        this.activeBucket = this.buckets[0];
      }
    }
    if (changes.results) {
      this.jobLibraryResults = cloneDeep(this.results);
    }
  }

  // Private Methods
  private buildSearchRequest() {
    const searchRequest: LibrarySearchRequest = {
      BucketKey: this.activeBucket ? this.activeBucket.Key : '',
      Keyword: this.keyword,
      PageSize: this.pageSize,
      PageNumber: this.pageNumber,
      JobTitle: this.jobTitleSearch,
      JobDescriptionId: null
    };

    return searchRequest;
  }

  private showViewMoreLink(result: any) {
    let showViewMoreLink = false;
    if (!result.Highlights.length) {
      return false;
    }
    const stripHtml = new StripHtmlPipe();
    const htmlStrippedFragment = stripHtml.transform(result.Highlights[0]);
    const content = result.Content;

    if (htmlStrippedFragment !== content) {
      // Hack. Some fragments will come back with a missing period.
      if (content == null || htmlStrippedFragment == null
        || (content.length - htmlStrippedFragment.length === 1 && content.slice(-1) === '.')) {
        showViewMoreLink = false;
      } else {
        showViewMoreLink = true;
      }
    }

    return showViewMoreLink;
  }
}
