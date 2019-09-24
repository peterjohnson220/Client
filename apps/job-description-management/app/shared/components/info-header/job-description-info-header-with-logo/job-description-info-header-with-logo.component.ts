import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';
import {Store} from '@ngrx/store';

import { JobDescriptionInfoHeaderBase} from '../job-description-info-header-base';
import {JobDescriptionAppliesToItem} from '../../../models/job-description-appliesto-item.model';
import * as fromJobDescriptionAppliesToReducers from '../../../reducers';

@Component({
  selector: 'pf-job-description-info-header-with-logo',
  templateUrl: './job-description-info-header-with-logo.component.html',
  styleUrls: ['./job-description-info-header-with-logo.component.scss']
})
export class JobDescriptionInfoHeaderWithLogoComponent extends JobDescriptionInfoHeaderBase implements OnInit, OnDestroy {
  appliesToItemsSubscription: Subscription;
  jobDescriptionAppliesToItems: JobDescriptionAppliesToItem[];
  publicBaseUrl: string;

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
  }

  ngOnDestroy() {
    this.appliesToItemsSubscription.unsubscribe();
  }

}
