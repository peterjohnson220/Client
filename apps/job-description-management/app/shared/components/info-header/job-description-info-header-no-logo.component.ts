import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromJobDescriptionAppliesToReducers from '../../reducers/index';
import { JobDescriptionInfoHeaderBase } from './job-description-info-header-base';
import { JobDescriptionAppliesToItem } from '../../models/job-description-appliesto-item.model';

@Component({
  selector: 'pf-job-description-info-header-no-logo',
  templateUrl: './job-description-info-header-no-logo.component.html',
  styleUrls: ['./job-description-info-header-no-logo.component.scss']
})
export class JobDescriptionInfoHeaderNoLogoComponent extends JobDescriptionInfoHeaderBase implements OnInit, OnDestroy {
  appliesToItemsSubscription: Subscription;
  jobDescriptionAppliesToItems: JobDescriptionAppliesToItem[];

  constructor(
    private noLogoStore: Store<fromJobDescriptionAppliesToReducers.State>
  ) {
    super(noLogoStore);
  }

  ngOnInit() {
    this.appliesToItemsSubscription = this.jobDescriptionAppliesToItems$.subscribe(items => {
      this.jobDescriptionAppliesToItems = items;
    });
  }

  ngOnDestroy() {
    this.appliesToItemsSubscription.unsubscribe();
  }
}
