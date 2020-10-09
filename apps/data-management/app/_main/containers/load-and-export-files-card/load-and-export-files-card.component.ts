import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CompanySettingsEnum } from 'libs/models';
import { SettingsService } from 'libs/state/app-context/services';

@Component({
  selector: 'pf-load-and-export-files-card',
  templateUrl: './load-and-export-files-card.component.html',
  styleUrls: ['./load-and-export-files-card.component.scss'],
})
export class LoadAndExportFilesCardComponent implements OnInit, OnDestroy {

  manualImportOrgDataSubscription: Subscription;

  canImportOrgData: boolean;

  constructor(private settingsService: SettingsService) {

  }

  ngOnInit() {
    this.manualImportOrgDataSubscription = this.settingsService
      .selectCompanySetting<string>(CompanySettingsEnum.ManualOrgDataLoadLink, 'string')
      .subscribe(setting => this.canImportOrgData = (setting === 'true'));
  }

  ngOnDestroy() {
    this.manualImportOrgDataSubscription.unsubscribe();
  }

  canView() {
    return this.canImportOrgData;
  }
}
