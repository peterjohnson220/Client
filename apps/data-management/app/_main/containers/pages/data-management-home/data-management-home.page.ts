import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'pf-data-management-home-page',
  templateUrl: './data-management-home.page.html',
  styleUrls: ['./data-management-home.page.scss']
})
export class DataManagementHomePageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private eventsSubscription: Subscription;
  fullPage = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.url.subscribe(d => {
      let route = this.activatedRoute.snapshot.firstChild;
      while (route.firstChild) {
        route = route.firstChild;
      }
      const x = route.data;
      this.fullPage = x && x.FullPage === true;
    });
    this.eventsSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
        this.fullPage = data && data.FullPage === true;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }
}
