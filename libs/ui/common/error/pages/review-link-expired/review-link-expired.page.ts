import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pf-review-link-expired-page',
  templateUrl: 'review-link-expired.page.html',
  styleUrls: ['review-link-expired.page.scss']
})

export class ReviewLinkExpiredPageComponent {

  isInSystem: boolean;

  constructor(private router: Router) {
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
