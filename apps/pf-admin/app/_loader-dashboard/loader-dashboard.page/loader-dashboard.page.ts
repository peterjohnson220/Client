import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AbstractFeatureFlagService, FeatureFlags, RealTimeFlag } from 'libs/core';

@Component({
  selector: 'pf-loader-dashboard-page',
  templateUrl: './loader-dashboard.page.html',
  styleUrls: ['./loader-dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardPageComponent implements OnInit, OnDestroy {
  private unsubscribeSidebarAndModifiedRedropsFlag$ = new Subject<void>();
  selectedPage: string;
  loaderDashboardSidebarAndModifiedRedropsFeatureFlag: RealTimeFlag = { key: FeatureFlags.LoaderDashboardSidebarAndModifiedRedrops, value: false };

  constructor(private featureFlagService: AbstractFeatureFlagService) {
    this.selectedPage = 'dataLoadSummary';
    this.featureFlagService.bindEnabled(this.loaderDashboardSidebarAndModifiedRedropsFeatureFlag, this.unsubscribeSidebarAndModifiedRedropsFlag$);
  }

  public selectPage(pageName: string): void {
    this.selectedPage = pageName;
  }

  ngOnDestroy() {
    this.unsubscribeSidebarAndModifiedRedropsFlag$.next();
  }

  ngOnInit() {
  }
}
