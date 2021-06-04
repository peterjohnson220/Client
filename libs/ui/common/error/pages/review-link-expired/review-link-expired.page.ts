import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core/services/feature-flags';
import { Subject } from 'rxjs';

@Component({
  selector: 'pf-review-link-expired-page',
  templateUrl: 'review-link-expired.page.html',
  styleUrls: ['review-link-expired.page.scss']
})

export class ReviewLinkExpiredPageComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  jdmInboxFeatureFlag: RealTimeFlag = { key: FeatureFlags.JdmInbox, value: false };
  isInSystem: boolean;

  constructor(private router: Router,
              private featureFlagService: AbstractFeatureFlagService) {

    if (this.router.url === '/in-system-gone') {
      this.isInSystem = true;
      this.featureFlagService.bindEnabled(this.jdmInboxFeatureFlag, this.unsubscribe$);
    }
  }

  backToJobDescriptionList() {
    this.router.navigate(['/']);
  }

  backToJobDescriptionInbox() {
    this.router.navigate(['/inbox']);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
