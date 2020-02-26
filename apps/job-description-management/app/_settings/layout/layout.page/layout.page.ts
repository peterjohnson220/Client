import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models';

@Component({
  selector: 'pf-settings-layout-page',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss']
})
export class LayoutPageComponent implements OnInit, OnDestroy {
  navLinks = [
    {name: 'Job Description Views', route: '/settings/job-description-views' },
    {name: 'Routing Workflows', route: '/settings/workflows' },
    {name: 'Manage Company Controls', route: '/settings/company-controls' },
    {name: 'Footer View', route: '/settings/jdm-footer-view' }
  ];
  enableCoreJdmInClient$: Observable<boolean>;
  enableCoreJdmInClientSubscription: Subscription;

  jdmUrl = '/ng/job-description-management/job-descriptions';

  constructor(private settingService: SettingsService) {
    this.enableCoreJdmInClient$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMCoreUseClient
    );
  }

  ngOnInit() {
    this.enableCoreJdmInClientSubscription = this.enableCoreJdmInClient$.subscribe((setting) => {
      if (setting === true) {
        this.jdmUrl = '/client/job-description-management/templates';
      }
    });
  }

  ngOnDestroy() {
    this.enableCoreJdmInClientSubscription.unsubscribe();
  }
}
