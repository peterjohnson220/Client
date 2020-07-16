import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import { JobDescriptionInfoHeaderBase } from '../job-description-info-header-base';
import { JobDescriptionAppliesToItem } from 'libs/features/job-description-management/models';
import * as fromJobDescriptionAppliesToReducers from 'libs/features/job-description-management/reducers';

@Component({
  selector: 'pf-job-description-info-header-with-logo',
  templateUrl: './job-description-info-header-with-logo.component.html',
  styleUrls: ['./job-description-info-header-with-logo.component.scss']
})
export class JobDescriptionInfoHeaderWithLogoComponent extends JobDescriptionInfoHeaderBase implements OnInit, OnDestroy {
  appliesToItemsSubscription: Subscription;
  jobDescriptionAppliesToItems: JobDescriptionAppliesToItem[];
  publicBaseUrl: string;
  imageError: boolean;

  constructor(
    private noLogoStore: Store<fromJobDescriptionAppliesToReducers.State>

  ) {
    super(noLogoStore);
  }

  @Input() companyName: string;
  @Input() companyLogoPath: string;

  ngOnInit() {
    super.ngOnInit();

    this.userContext$.subscribe(i => {
      this.publicBaseUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/';
    });

    this.appliesToItemsSubscription = this.jobDescriptionAppliesToItems$.subscribe(items => {
      this.jobDescriptionAppliesToItems = items;
    });

    this.imageError = false;
  }

  onImageError() {
    this.imageError = true;
  }

  ngOnDestroy() {
    this.appliesToItemsSubscription.unsubscribe();
  }

}
