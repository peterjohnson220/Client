import { JobDescriptionSharingService } from './../../services';
import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { SharedJobDescription } from '../../models';

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

  shares: SharedJobDescription[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  sharesSubscription: Subscription;

  constructor(private jobDescriptionSharingService: JobDescriptionSharingService ) {
    this.shares = [];
  }

  ngOnInit(): void {
    this.jobDescriptionSharingService.init();
    this.isLoading = true;
    this.isEmpty = true;
    this.sharesSubscription = this.jobDescriptionSharingService.getShares(this.companyId, this.jobDescriptionId).subscribe({
      next: share => {
        this.shares.push(share);
        this.isEmpty = false;
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
}
