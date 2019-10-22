import { Component, ViewChild, EventEmitter, Output, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import * as cloneDeep from 'lodash.clonedeep';

import { SharedDataViewUser } from '../../models';

@Component({
  selector: 'pf-share-report-modal',
  styleUrls: ['./share-report-modal.component.scss'],
  templateUrl: './share-report-modal.component.html'
})
export class ShareReportModalComponent {
  @Input() users: SharedDataViewUser[];
  @Output() shareClicked = new EventEmitter<SharedDataViewUser[]>();

  @ViewChild('shareReportModal', { static: false }) public shareReportModal: any;
  selectedUsers: SharedDataViewUser[] = [];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  constructor(
    private modalService: NgbModal
  ) {}

  open(): void {
    this.modalService.open(this.shareReportModal, {backdrop: 'static', centered: true});
  }

  close(): void {
    this.resetChanges();
    this.modalService.dismissAll();
  }

  share(): void {
    this.shareClicked.emit(this.selectedUsers);
    this.resetChanges();
    this.close();
  }

  trackByFn(index: any, userPermission: SharedDataViewUser) {
    return userPermission.UserId;
  }

  deleteSharePermission(permission: SharedDataViewUser) {
    this.selectedUsers = this.selectedUsers.filter(x => x.UserId !== permission.UserId);
  }

  handleSelectedUsersChanged(users: SharedDataViewUser[]): void {
    this.selectedUsers = cloneDeep(users);
  }

  private resetChanges() {
    this.selectedUsers = [];
  }
}
