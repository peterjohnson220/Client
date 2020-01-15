import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pf-data-management-home-page',
  templateUrl: './data-management-home.page.html',
  styleUrls: ['./data-management-home.page.scss']
})
export class DataManagementHomePageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  fullPage = false;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.url.subscribe(d => {
      const x = this.activatedRoute.snapshot.firstChild.data;
      this.fullPage = x && x.FullPage === true;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
