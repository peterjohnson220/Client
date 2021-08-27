import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { CompanyJob } from 'libs/features/peer/job-association/models/company-job.model';
import { Permissions } from 'libs/constants';
import { StatusEnum } from 'libs/models/common';

@Component({
  selector: 'pf-exchange-job-detail',
  templateUrl: './exchange-job-detail.component.html',
  styleUrls: ['./exchange-job-detail.component.scss']
})
export class ExchangeDetailComponent {
  @Input() selectedCompanyJob: CompanyJob;
  @Input() savingAssociation: boolean;
  @Input() savingAssociationError: boolean;

  @Input() exchangeJobLoading: boolean;
  @Input() exchangeJobLoadingSuccess: boolean;
  @Input() exchangeJobLoadingError: boolean;
  @Input() exchangeJob: ExchangeJob;
  @Input() createProjectButtonEnabled: boolean;

  @Output() approveClick = new EventEmitter();
  @Output() rejectClick = new EventEmitter();
  @Output() unmatchClick = new EventEmitter();
  @Output() createProjectClick = new EventEmitter();

  permissions = Permissions;

  constructor() {}

  handleApproveClick() {
    this.approveClick.emit(this.exchangeJob);
  }

  handleRejectClick() {
    this.rejectClick.emit(this.exchangeJob);
  }

  handleUnmatchClick() {
    this.unmatchClick.emit();
  }

  handleCreateProjectClick() {
    this.createProjectClick.emit();
  }
}
