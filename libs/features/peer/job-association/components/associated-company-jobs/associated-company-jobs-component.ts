import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyJob } from '../../models';

@Component({
  selector: 'pf-peer-job-association-associated-jobs',
  templateUrl: './associated-company-jobs.component.html',
  styleUrls: ['./associated-company-jobs.component.scss']
})
export class AssociatedCompanyJobsComponent {
  @Input() newAssociations: CompanyJob[];
  @Input() previousAssociations: CompanyJob[];
  @Input() previousAssociationPendingRemoval: number[];
  @Input() loadingPreviousAssociations: boolean;
  @Input() loadingPreviousAssociationsError: boolean;

  @Output() removeNewAssociation = new EventEmitter<number>();
  @Output() removePreviousAssociation = new EventEmitter<number>();
  @Output() undoRemovePreviousAssociation = new EventEmitter<number>();

  constructor() {}

  hasAssociations(): boolean {
    return this.newAssociations.length > 0 || this.previousAssociations.length > 0;
  }

  isPendingRemoval(companyJobId: number): boolean {
    if (!this.previousAssociationPendingRemoval || this.previousAssociationPendingRemoval.length === 0) {
      return false;
    }
    return this.previousAssociationPendingRemoval.some(_companyJobId => _companyJobId === companyJobId);
  }

  handleRemoveNewAssociate(companyJobId: number) {
    this.removeNewAssociation.emit(companyJobId);
  }

  handleRemovePreviousAssociation(companyJobId: number) {
    this.removePreviousAssociation.emit(companyJobId);
  }

  handleUndoRemovePreviousAssociation(companyJobId: number) {
    this.undoRemovePreviousAssociation.emit(companyJobId);
  }

  trackByFn(index, item) {
    return item.CompanyJobId;
  }
}
