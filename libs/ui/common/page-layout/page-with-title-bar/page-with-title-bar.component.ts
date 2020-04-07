import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteTrackingService } from 'libs/core/services';

@Component({
  selector: 'pf-page-with-title-bar',
  templateUrl: './page-with-title-bar.component.html',
  styleUrls: ['./page-with-title-bar.component.scss']
})
export class PageWithTitleBarComponent {
  @Input() isFullHeader = true;
  @Input() returnUrl: string;
  @Input() relativeReturn: boolean;
  @Input() goBackToPreviousRoute: boolean;
  @Input() absoluteUrl: string;
  @Input() contentNoPadding: boolean;
  @Input() contentClassNamesOverrides: boolean;

  // Application will be reloaded when the goBackUsingBrowserHistory
  // is used to navigate back to the previous view
  @Input() goBackUsingBrowserHistory: boolean;

  constructor(
    private routeTrackingService: RouteTrackingService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  goBack() {
    if (this.goBackUsingBrowserHistory) {
      return this.location.back();
    }

    this.goBackToPreviousRoute
      ? this.routeTrackingService.goBack()
      : this.router.navigate([this.returnUrl], this.relativeReturn ? { relativeTo: this.route } : {});
  }
}
