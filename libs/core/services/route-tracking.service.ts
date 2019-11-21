import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter, pairwise, startWith } from 'rxjs/operators';

@Injectable()
export class RouteTrackingService {
  previousRoute = '';
  currentRoute = '';

  constructor(
    private router: Router
  ) {
    this.router.events
      .pipe(
        startWith(new NavigationEnd(0, '/', '/')),
        filter(e => e instanceof NavigationEnd),
        pairwise()
      ).subscribe((e: any) => {
        this.previousRoute = e[0].url;
        this.currentRoute = e[1].url;
      });
  }

  goBack() {
    const previousRoute = this.previousRoute;
    const fallBackRoute = this.currentRoute.substring(0, this.currentRoute.lastIndexOf('/'));

    !!previousRoute && previousRoute !== '/'
      ? this.router.navigate([previousRoute])
      : this.router.navigate([fallBackRoute]);
  }
}
