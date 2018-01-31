import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CompanyJobToMapTo } from 'libs/models/peer';

@Component({
  selector: 'pf-company-job-map-result',
  templateUrl: './company-job-map-result.component.html',
  styleUrls: ['./company-job-map-result.component.scss']
})
export class CompanyJobMapResultComponent {
  @Input() companyJobToMapTo: CompanyJobToMapTo;
  @Input() applyingMapping: boolean;
  @Input() applyingMappingError: boolean;
  @Input() selectedMapping: boolean;
  @Output() applyMapping = new EventEmitter();
  @Output() clicked = new EventEmitter();

  constructor() {}

  handleApplyMappingClicked(companyJobId: number) {
    this.applyMapping.emit(companyJobId);
  }
}
