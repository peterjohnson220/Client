import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromRootState from '../../state/state';
import { NewRelicService, RouteTrackingService, AbstractFeatureFlagService, FeatureFlagHelper } from '../../core/services';
import { UserContext } from '../../models/security';

@Component({
  selector: 'pf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class.ready') ready = false;

  hasUserContext$: Observable<boolean>;
  forbidden$: Observable<boolean>;
  userContext$: Observable<UserContext>;
  hasUserContextSub: Subscription;
  userContextSub: Subscription;
  forbiddenSub: Subscription;

  forbidden: boolean;

  maskExpressions = [
    { regex: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, replace: '*'},
    { regex: /[0-9a-fA-F]{24}/, replace: '*'},
    { regex: /company-reports\/(.*)/,  replace: 'company-reports/*'},
    { regex: /standard-reports\/(.*)/,  replace: 'standard-reports/*'},
    { regex: /compare-versions\/(.*)/,  replace: 'compare-versions/*'},
    { regex: /tag\/(.*)/,  replace: 'tag/*'},
    { regex: /#(.*)/,  replace: '*'},
    { regex: /\/([0-9]+)$/, replace: '/*'},
    { regex: /\/([0-9]+)\//, replace: '/*/'},
    { regex: /\/([0-9]+)#(.*)/, replace: '/*'},
    { regex: /\?(.*)/, replace: '?*'}
  ];

  constructor(
    private store: Store<fromRootState.State>,
    // Initializing the route tracking service to start tracking on app startup by requesting it here
    private routeTrackingService: RouteTrackingService,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasUserContext$ = this.store.select(fromRootState.hasUserContext);
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.forbidden$ = this.store.select(fromRootState.getForbidden);
  }

  ngOnInit(): void {
    this.hasUserContextSub = this.hasUserContext$.subscribe(huc => this.ready = huc);
    this.forbiddenSub = this.forbidden$.subscribe(f => {
      this.forbidden = f;
      if (this.forbidden && this.ready === false) {
        this.ready = true;
      }
    });
    this.userContextSub = this.userContext$.pipe(filter(uc => !!uc)).subscribe(uc => {
      NewRelicService.setCustomAttributes(uc.CompanyId, uc.UserId, uc.IpAddress, uc.SessionId, this.getTargetUrl());
      this.featureFlagService.initialize(uc.ConfigSettings.find(cs => cs.Name === 'LaunchDarklyClientSdkKey')?.Value,
        FeatureFlagHelper.buildContext(uc), uc.FeatureFlagBootstrapJson);
    });
  }

  getTargetUrl(): string {
    let url = window.location.href;
    this.maskExpressions.forEach(v => {
      url = url.replace(v.regex, v.replace);
    });
    return url;
  }

  ngOnDestroy(): void {
    this.hasUserContextSub.unsubscribe();
    this.userContextSub.unsubscribe();
    this.forbiddenSub.unsubscribe();
  }
}
