import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Subscription, Observable } from 'rxjs';

import { CompanyJob, CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';

@Component({
  selector: 'pf-company-job-detail',
  templateUrl: './company-job-detail.component.html',
  styleUrls: ['./company-job-detail.component.scss']
})
export class CompanyJobDetailComponent implements OnInit, OnDestroy {
  @Input() selectedCompanyJob: CompanyJob;
  @Input() jdmDescriptionIds: number[];
  @Input() jdmDescriptionLoading: boolean;
  @Input() jdmDescriptionLoadingError: boolean;

  @Output() viewJdmDescriptionClick = new EventEmitter();

  jdmUrl = '/ng/job-description-management/job-descriptions';
  enableCoreJdmInClient$: Observable<boolean>;
  enableCoreJdmInClientSubscription: Subscription;

  constructor(private settingService: SettingsService) {
    this.enableCoreJdmInClient$ = this.settingService.selectCompanySetting<boolean>(
      CompanySettingsEnum.JDMCoreUseClient
    );
  }

  ngOnInit() {
    this.enableCoreJdmInClientSubscription = this.enableCoreJdmInClient$.subscribe((setting) => {
      if (setting === true) {
        this.jdmUrl = '/client/job-description-management/job-descriptions';
      }
    });
  }

  ngOnDestroy() {
    this.enableCoreJdmInClientSubscription.unsubscribe();
  }

  handleViewJdmDescriptionClick() {
    this.viewJdmDescriptionClick.emit();
  }

}
