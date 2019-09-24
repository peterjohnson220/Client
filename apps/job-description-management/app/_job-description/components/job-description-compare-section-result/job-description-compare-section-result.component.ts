import {Component, Input, OnInit} from '@angular/core';

import { JobDescriptionSection } from 'libs/models/jdm';

import {JobDescriptionVersionCompareService} from '../../services';

@Component({
  selector: 'pf-job-description-compare-section-result',
  templateUrl: './job-description-compare-section-result.component.html',
  styleUrls: ['./job-description-compare-section-result.component.scss',
              '../shared-comparison-styles.scss',
              '../job-description-section/job-description-section.component.scss']
})
export class JobDescriptionCompareSectionResultComponent implements OnInit {
  hideBody = true;

  @Input() section: JobDescriptionSection;
  @Input() controlTypesLoaded = false;
  @Input() index: number;
  constructor(private jobDescriptionVersionCompareService: JobDescriptionVersionCompareService) { }

  toggleBody() {
    this.hideBody = !this.hideBody;
  }

  wasAdded() {
    return this.section.Statuses && this.jobDescriptionVersionCompareService.wasAdded(this.section.Statuses);
  }

  wasRemoved() {
    return this.section.Statuses && this.jobDescriptionVersionCompareService.wasRemoved(this.section.Statuses);
  }

  wasMoved() {
    return this.section.Statuses && this.jobDescriptionVersionCompareService.wasMoved(this.section.Statuses);
  }

  ngOnInit() {
    if (this.section.Statuses) {
      this.hideBody = !this.section.Statuses.some(s => s === 'ChildrenChanged');
    }
  }

}
