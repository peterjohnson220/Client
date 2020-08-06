import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Observable } from 'rxjs';

import { CompanyEmployee } from 'libs/models/company';

@Component({
  selector: 'pf-unassign-employees-modal',
  templateUrl: './unassign-employees-modal.component.html',
  styleUrls: ['./unassign-employees-modal.component.scss']
})
export class UnassignEmployeesModalComponent {
  @Input() isOpen$: Observable<boolean>;

  @Input() statementName: string;
  @Input() singleEmployee: CompanyEmployee;
  @Input() isSingleEmployeeUnassign: boolean;
  @Input() sendingUnassignRequest: boolean;
  @Input() sendingUnassignRequestSuccess: boolean;
  @Input() sendingUnassignRequestError: boolean;
  @Input() selectedCompanyEmployeeIds: number[] = [];

  @Output() unassignEmployeesClick = new EventEmitter();
  @Output() cancelClick = new EventEmitter();

  constructor() { }

  onUnassignEmployees() {
    this.unassignEmployeesClick.emit();
  }

  onCancel() {
    this.cancelClick.emit();
  }

}
