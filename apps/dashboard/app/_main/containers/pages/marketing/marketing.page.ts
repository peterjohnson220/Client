import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRootState from 'libs/state/state';

import { UserContext } from 'libs/models';
import { TileNames } from 'libs/constants';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'pf-marketing-page',
  templateUrl: './marketing.page.html',
  styleUrls: [ './marketing.page.scss' ]
})
export class MarketingPageComponent implements OnInit, OnDestroy {
  readonly BASE_URL =  'https://info.payfactors.com';
  identity$: Observable<UserContext>;
  identitySubscription: Subscription;
  marketingUrl: SafeResourceUrl;
  userEmail: string;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private userContextStore: Store<fromRootState.State>) {
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  ngOnInit() {
    this.identitySubscription = this.identity$.subscribe(identity => {
      if (identity && identity.EmailAddress) {
        this.userEmail = identity.EmailAddress;
        this.buildSourceUrl();
      }
    });
  }

  ngOnDestroy() {
    this.identitySubscription.unsubscribe();
  }

  buildSourceUrl() {
    const featurePath = this.route.snapshot.routeConfig.path;
    const featureName = this.transformToTitleCase(featurePath);

    switch (featureName) {
      case TileNames.DataInsights:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-data-insights?email=${this.userEmail}`);
        break;
      case TileNames.Employees:
      case TileNames.Jobs:
      case TileNames.PayMarkets:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-centralize-data?email=${this.userEmail}`);
        break;
      case TileNames.JobDescriptions:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-jdm?email=${this.userEmail}`);
        break;
      case TileNames.Peer:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-peer?email=${this.userEmail}`);
        break;
      case TileNames.PricingProjects:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-pricing-projects?email=${this.userEmail}`);
        break;
      case TileNames.Surveys:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-surveys?email=${this.userEmail}`);
        break;
      case TileNames.TotalRewards:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-trs?email=${this.userEmail}`);
        break;
      case TileNames.InternationalData:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-international?email=${this.userEmail}`);
        break;
      case TileNames.Structures:
        this.marketingUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.BASE_URL}/product-structures?email=${this.userEmail}`);
        break;
    }
  }

  transformToTitleCase(path: string): string {
    // converts kebab casing to title casing
    return path.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }
}
