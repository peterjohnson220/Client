import { Component, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import * as cloneDeep from 'lodash.clonedeep';

import { SharedUserPermission } from 'libs/models/payfactors-api';

import { SharedDataViewUser } from '../../models';

@Component({
  selector: 'pf-share-report-modal',
  styleUrls: ['./share-report-modal.component.scss'],
  templateUrl: './share-report-modal.component.html'
})
export class ShareReportModalComponent implements OnChanges {
  @Input() users: SharedDataViewUser[];
  @Input() sharedUserPermissions: SharedUserPermission[];
  @Input() loadingPermissions: boolean;
  @Output() shareClicked = new EventEmitter<SharedDataViewUser[]>();
  @Output() userRemoved = new EventEmitter<SharedDataViewUser>();

  @ViewChild('shareReportModal', { static: false }) public shareReportModal: any;
  selectedUsers: SharedDataViewUser[] = [];
  selectableUsers: SharedDataViewUser[] = [];
  existingUsers: SharedDataViewUser[] = [];
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
    this.shareClicked.emit(this.selectedUsers.concat(this.existingUsers));
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

  deleteExistingSharePermission(user: SharedDataViewUser) {
    this.userRemoved.emit(user);
  }

  private resetChanges() {
    this.selectedUsers = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.users || changes.sharedUserPermissions) {
      this.selectableUsers = this.getSelectableUsers();
      this.existingUsers = this.getExistingSharedUsers();
    }
  }

  private getExistingSharedUsers(): SharedDataViewUser[] {
    const existingUsers = [];
    const that = this;
    this.sharedUserPermissions.forEach(function(user) {
      const matchingUser = that.users.find(x => x.UserId === user.UserId);
      if (!!matchingUser) {
        existingUsers.push({
          ...matchingUser,
          CanEdit: user.CanEdit
        });
      }
    });
    return existingUsers;
  }

  private getSelectableUsers(): SharedDataViewUser[] {
    return this.users.filter(x => !this.sharedUserPermissions.some(y => y.UserId === x.UserId));
  }
}
