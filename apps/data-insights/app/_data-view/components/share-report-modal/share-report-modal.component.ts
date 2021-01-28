import { Component, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import cloneDeep from 'lodash/cloneDeep';

import { SharedDataViewUser } from 'libs/ui/formula-editor';

@Component({
  selector: 'pf-share-report-modal',
  styleUrls: ['./share-report-modal.component.scss'],
  templateUrl: './share-report-modal.component.html'
})
export class ShareReportModalComponent implements OnChanges {
  @Input() users: SharedDataViewUser[];
  @Input() sharedUserPermissions: SharedDataViewUser[];
  @Input() loadingPermissions: boolean;
  @Output() shareClicked = new EventEmitter<SharedDataViewUser[]>();
  @Output() userRemoved = new EventEmitter<SharedDataViewUser>();

  @ViewChild('shareReportModal') public shareReportModal: any;
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
    this.selectedUsers = [];
    this.modalService.dismissAll();
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
    this.existingUsers = cloneDeep(this.sharedUserPermissions);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.users || changes.sharedUserPermissions) {
      this.selectableUsers = this.getSelectableUsers();
      this.existingUsers = cloneDeep(this.sharedUserPermissions);
    }
  }

  private getSelectableUsers(): SharedDataViewUser[] {
    return this.users.filter(x => !this.sharedUserPermissions.some(y => y.UserId === x.UserId));
  }
}
