import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from '../../../../../core/services/feature-flags';
import { Subject } from 'rxjs';

@Component({
  selector: 'pf-review-link-expired-page',
  templateUrl: 'review-link-expired.page.html',
  styleUrls: ['review-link-expired.page.scss']
})

export class ReviewLinkExpiredPageComponent {
  private unsubscribe$ = new Subject<void>();
  jdmInboxFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmInbox, value: false };
  isInSystem: boolean;

  constructor(private router: Router,
              private featureFlagService: AbstractFeatureFlagService) {

    this.featureFlagService.bindEnabled(this.jdmInboxFeatureFlag, this.unsubscribe$);

    if (this.router.url === '/in-system-gone') {
      this.isInSystem = true;
    }
  }

  backToJobDescriptionList() {
    this.router.navigate(['/']);
  }

  backToJobDescriptionInbox() {
    this.router.navigate(['/inbox']);
  }
}
