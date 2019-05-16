import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';

import { filter } from 'rxjs/operators';
import 'rxjs/add/operator/pairwise';

@Injectable()
export class RouteTrackingService {
  previousRoute = '';
  currentRoute = '';

  constructor(
    private router: Router
  ) {
    this.router.events
      .pipe(filter(e => e instanceof RoutesRecognized))
      .pairwise()
      .subscribe((e: any[]) => {
        this.previousRoute = e[0].url;
        this.currentRoute = e[1].url;
      });
  }
}
