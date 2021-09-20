import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { WorkflowUser } from 'libs/features/jobs/job-description-management';

@Component({
  selector: 'pf-user-pill',
  templateUrl: './user-pill.component.html',
  styleUrls: ['./user-pill.component.scss']
})
export class UserPillComponent implements OnInit {

  @Input() user: WorkflowUser;
  @Input() avatarUrl: string;
  @Input() removeIcon = false;
  @Output() onRemoveClicked = new EventEmitter<boolean>();

  displayNameThreshold = 30;

  constructor() { }

  ngOnInit(): void {
  }

  isUserImg() {
    return this.user.UserPicture && this.user.UserPicture !== 'default_user.png';
  }

  getUserInitials(): string {
    return `${this.user.FirstName.substring(0, 1)}${this.user.LastName.substring(0, 1)}`.toUpperCase();
  }

  getDisplayName(): string {
    return this.user.UserId ? `${this.user.FirstName} ${this.user.LastName}` : this.user.EmailAddress;
  }

  showDisplayNameTooltip(ngbTooltip: NgbTooltip) {
    const displayName = this.getDisplayName();

    if (displayName.trim().length > this.displayNameThreshold) {
      ngbTooltip.open();
    }
  }

  hideDisplayNameTooltip(ngbTooltip: NgbTooltip) {
    if (ngbTooltip.isOpen()) {
      ngbTooltip.close();
    }
  }

  handleRemoveClicked() {
    this.onRemoveClicked.emit();
  }
}
