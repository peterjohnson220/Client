import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {ControlType, ControlTypeAttribute} from 'libs/models/common';

import {JobDescriptionVersionCompareService} from '../../services/job-description-version-compare.service';

@Component({
  selector: 'pf-job-description-compare-data-result',
  templateUrl: './job-description-compare-data-result.component.html',
  styleUrls: ['./job-description-compare-data-result.component.scss']
})
export class JobDescriptionCompareDataResultComponent implements OnInit {
  hasDataThatWasMoved: boolean;

  @Input() controlType: ControlType;
  @Input() attributes: ControlTypeAttribute[];
  @Input() data: any;
  @Input() additionalProperties: any;

  constructor( private sanitizer: DomSanitizer,
               private jobDescriptionVersionCompareService: JobDescriptionVersionCompareService) { }

  getSmartListBullet(index: number) {
    return this.additionalProperties && this.additionalProperties.ListType === 'OL' ? `${index + 1}.` : '&bull;';
  }

  wasAdded(dataRow: any) {
    return dataRow.Statuses && this.jobDescriptionVersionCompareService.wasAdded(dataRow.Statuses);
  }

  wasRemoved(dataRow: any) {
    return dataRow.Statuses && this.jobDescriptionVersionCompareService.wasRemoved(dataRow.Statuses);
  }

  wasMoved(dataRow: any) {
    return dataRow.Statuses && this.jobDescriptionVersionCompareService.wasMoved(dataRow.Statuses);
  }

  ngOnInit() {
  }
}
