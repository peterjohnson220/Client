import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromJdmSharedReducer from 'libs/features/jobs/job-description-management/reducers';
@Component({
  selector: 'pf-settings-layout-page',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})

export class LayoutPageComponent implements OnInit, OnDestroy {
  public navigatedToSettings$: Observable<any>;
  private navigatedToSettingsSubscription: Subscription;

  returnUrl = '/';

  navLinks = [
    {name: 'Job Description Views', route: '/settings/job-description-views' },
    {name: 'Workflows', route: '/settings/workflows' },
    {name: 'Manage Company Controls', route: '/settings/company-controls' },
    {name: 'Footer View', route: '/settings/jdm-footer-view' }
  ];

  constructor(private store: Store<fromJdmSharedReducer.State>) {
    this.navigatedToSettings$ = this.store.select(fromJdmSharedReducer.getNavigatedToSettings);
  }

  ngOnInit() {
    this.navigatedToSettingsSubscription = this.navigatedToSettings$.subscribe(navigatedFrom => {
      if (navigatedFrom) {
        this.returnUrl = navigatedFrom.source;
        if (navigatedFrom.templateId) {
          this.returnUrl = `${navigatedFrom.source}/${navigatedFrom.templateId}`;
        }
      }
    });
  }

  ngOnDestroy() {
    this.navigatedToSettingsSubscription.unsubscribe();
  }
}
