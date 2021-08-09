import { Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedJobDescription } from '../../models';

@Component({
  selector: 'pf-share-permissions-panel',
  templateUrl: './share-permissions-panel.component.html',
  styleUrls: ['./share-permissions-panel.component.scss']
})
export class SharePermissionsPanelComponent implements OnInit {

  @Input() getShares: Observable<SharedJobDescription>;
  @Output() onClose = new EventEmitter();
  @Output() onShare = new EventEmitter();
  shares: SharedJobDescription[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;

  constructor() {
    this.shares = [];
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isEmpty = true;
    this.getShares.subscribe({
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
}
