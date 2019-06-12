import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CompanyJob } from 'libs/models/company';

@Component({
  selector: 'pf-company-job-detail',
  templateUrl: './company-job-detail.component.html',
  styleUrls: ['./company-job-detail.component.scss']
})
export class CompanyJobDetailComponent {
  @Input() selectedCompanyJob: CompanyJob;
  @Input() jdmDescriptionIds: number[];
  @Input() jdmDescriptionLoading: boolean;
  @Input() jdmDescriptionLoadingError: boolean;

  @Output() viewJdmDescriptionClick = new EventEmitter();

  constructor() { }

  handleViewJdmDescriptionClick() {
    this.viewJdmDescriptionClick.emit();
  }

}
