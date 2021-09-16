import { JobDescriptionSharingService } from './../../services';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { SharedJobDescriptionUser } from '../../models';

@Component({
  selector: 'pf-share-permissions-panel',
  templateUrl: './share-permissions-panel.component.html',
  styleUrls: ['./share-permissions-panel.component.scss']
})
export class SharePermissionsPanelComponent implements OnInit, OnDestroy {

  @Input() companyId: number;
  @Input() jobDescriptionId: number;
  @Output() onClose = new EventEmitter();
  @Output() onShare = new EventEmitter();

  shares: SharedJobDescriptionUser[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  sharesSubscription: Subscription;

  constructor(private jobDescriptionSharingService: JobDescriptionSharingService) {
    
    this.shares = [];
  }

  ngOnInit(): void {
    this.jobDescriptionSharingService.init();
    this.isLoading = true;
    this.isEmpty = true;
    this.sharesSubscription = this.jobDescriptionSharingService.getSharedUsers(this.jobDescriptionId).subscribe({
      next: newShares => {
        this.shares = newShares;
        this.isEmpty = !newShares || newShares.length === 0;
      },
      error: _ => {
        this.isError = true;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sharesSubscription.unsubscribe();
    this.jobDescriptionSharingService.destroy();
  }

  // * This should handle sending a request to resend an email to that user
  handleResendEmailClicked(share): void {
    this.jobDescriptionSharingService.resendEmail();
  }

  getDisplayName(firstName: string, lastName:string, email: string): string {
    // users should have both first and last name.  Email is fallback for edge case.
    return (firstName && lastName) 
      ? `${firstName} ${lastName}`
      : email;
  }
}
