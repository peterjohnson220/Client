import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyJob } from '../../models';

@Component({
  selector: 'pf-peer-job-association-associated-jobs',
  templateUrl: './associated-company-jobs.component.html',
  styleUrls: ['./associated-company-jobs.component.scss']
})
export class AssociatedCompanyJobsComponent {
  @Input() companyJobs: CompanyJob[];
  @Output() removeAssociation = new EventEmitter<number>();

  constructor() {}

  handleRemoveAssociate(companyJobId: number) {
    this.removeAssociation.emit(companyJobId);
  }

  trackByFn(index, item) {
    return item.CompanyJobId;
  }
}
