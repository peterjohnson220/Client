import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanySettingsEnum } from 'libs/models/company';
import { SettingsService } from 'libs/state/app-context/services';
import { FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';
import { Permissions } from 'libs/constants';

import { Workbook } from '../../../models';
import * as fromDataInsightsPageActions from '../../../actions/data-insights-page.actions';
import * as fromDashboardsActions from '../../../actions/dashboards.actions';
import * as fromViewsActions from '../../../actions/views.actions';
import * as fromDataInsightsMainReducer from '../../../reducers';
import { SearchWorkbookModalComponent } from '../../search-workbook-modal';

@Component({
  selector: 'pf-data-insights-page',
  templateUrl: './data-insights.page.html',
  styleUrls: ['./data-insights.page.scss']
})
export class DataInsightsPageComponent implements OnInit, OnDestroy {
  @ViewChild(SearchWorkbookModalComponent, { static: true })
  public searchWorkbookModalComponent: SearchWorkbookModalComponent;
  reportBuilderSettingEnabled$: Observable<boolean>;
  standardReports$: Observable<AsyncStateObj<Workbook[]>>;
  showStandardReportsSection$: Observable<boolean>;
  thumbnailsViewSettingEnabled$: Observable<boolean>;

  showStandardReportsSectionSub: Subscription;
  thumbnailsViewSettingEnabledSub: Subscription;

  permissions = Permissions;
  showAllStandardReports: boolean;
  showStandardReportsSection: boolean;
  thumbnailsViewSettingEnabled: boolean;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>,
    private settingsService: SettingsService
  ) {
    this.standardReports$ = this.store.pipe(select(fromDataInsightsMainReducer.getStandardWorkbooksAsync));
    this.thumbnailsViewSettingEnabled$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DataInsightsThumbnailsViewDisplay
    );
    this.reportBuilderSettingEnabled$ = this.settingsService.selectCompanySetting<boolean>(
      CompanySettingsEnum.DataInsightsReportBuilder
    );
    this.showStandardReportsSection$ = this.settingsService.selectUiPersistenceSetting<boolean>(
      FeatureAreaConstants.DataInsights, UiPersistenceSettingConstants.ShowStandardReportsSection
    );
  }

  ngOnInit(): void {
    this.showStandardReportsSectionSub = this.showStandardReportsSection$.subscribe(result => {
      this.showStandardReportsSection = result !== null ? result : true;
    });
    this.thumbnailsViewSettingEnabledSub = this.thumbnailsViewSettingEnabled$.subscribe(settingEnabled => {
      if (settingEnabled === null || settingEnabled === undefined) {
        return;
      }
      this.thumbnailsViewSettingEnabled = settingEnabled;
      if (settingEnabled) {
        this.store.dispatch(new fromViewsActions.RefreshTableauReports());
        this.store.dispatch(new fromViewsActions.GetAllCompanyReportsViews());
      } else {
        this.store.dispatch(new fromDashboardsActions.GetCompanyWorkbooks());
      }
    });
    this.store.dispatch(new fromDataInsightsPageActions.GetStandardReports());
  }

  ngOnDestroy(): void {
    this.showStandardReportsSectionSub.unsubscribe();
    this.thumbnailsViewSettingEnabledSub.unsubscribe();
  }

  trackByFn(index: any, sr: Workbook) {
    return sr.WorkbookId;
  }

  handleSearchClicked() {
    this.searchWorkbookModalComponent.open();
  }

  toggleShowAllStandardReports() {
    this.showAllStandardReports = !this.showAllStandardReports;
  }

  toggleStandardReportsDisplay(): void {
    this.showStandardReportsSection = !this.showStandardReportsSection;
    this.store.dispatch(new fromDataInsightsPageActions.SaveStandardReportsDisplaySetting({
      settingValue: this.showStandardReportsSection
    }));
  }
}
