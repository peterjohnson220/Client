import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models';

@Component({
  selector: 'pf-grid-detail-panel',
  templateUrl: './grid-detail-panel.component.html',
  styleUrls: ['./grid-detail-panel.component.scss']
})
export class GridDetailPanelComponent implements OnInit, OnDestroy {
  @Input() isExpanded$: Observable<boolean>;
  @Input() checkForJdmDescription = false;

  @Input() jdmDescriptionIds: number[];
  @Input() jdmDescriptionLoading: boolean;
  @Input() jdmDescriptionLoadingError: boolean;

  @Input() jobId: number;
  @Input() jobTitle: string;
  @Input() jobDescription: string;
  @Input() jobCode: string;
  @Input() jobFamily: string;
  @Input() jobExchange: string;

  @Output() closeClick = new EventEmitter();
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

  handleClose() {
    this.closeClick.emit();
  }

  handleViewJdmDescriptionClick() {
    this.viewJdmDescriptionClick.emit();
  }
}
