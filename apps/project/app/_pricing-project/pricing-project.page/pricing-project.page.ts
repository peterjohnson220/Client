import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription} from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import { FileDownloadSecurityWarningModalComponent } from 'libs/ui/common/file-download-security-warning';
import { DataGridState } from 'libs/features/grids/pf-data-grid/reducers/pf-data-grid.reducer';
import { Permissions } from 'libs/constants';
import { ProjectContext } from 'libs/features/surveys/survey-search/models';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType} from 'libs/features/surveys/survey-search/data';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import { UserContext } from 'libs/models';
import { PricingProjectHelperService } from 'libs/core';
import { ProjectFieldManagementFeatureImplementations } from 'libs/features/projects/project-template-management/constants';
import * as fromCompanySettingsReducer from 'libs/state/state';
import * as fromRootState from 'libs/state/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFeatureActions from 'libs/features/search/search/actions/search-feature.actions';

import { PageViewIds } from '../../shared/constants';
import * as fromPricingProjectReducer from '../reducers';
import * as fromPricingProjectActions from '../actions';

@Component({
  selector: 'pf-pricing-project',
  templateUrl: './pricing-project.page.html',
  styleUrls: ['./pricing-project.page.scss']
})
export class PricingProjectPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('jobTitle') jobTitle: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('fileDownloadSecurityWarningModal', { static: true }) fileDownloadSecurityWarningModal: FileDownloadSecurityWarningModalComponent;
  @ViewChild('compColumn', { static: false }) compColumn: ElementRef;
  @ViewChild('percentageColumn', { static: false }) percentageColumn: ElementRef;
  @ViewChild('companyColumn', { static: false }) companyColumn: ElementRef;
  @ViewChild('customColumnChooser', {static: false}) customColumnChooser: ElementRef;

  permissions = Permissions;
  viewingJobSummary: boolean;
  projectSubscription: Subscription;
  projectContext: any;
  projectId: number;
  pageViewId = PageViewIds.ProjectJobs;
  filter = [];
  colTemplates = {};
  gridConfig: GridConfig;
  actionBarConfig: ActionBarConfig;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Job_Title'
  }, {
    dir: 'asc',
    field: 'vw_ProjectJobPayMarketMetadata_Paymarket'
  }];

  companySettingsSubscription: Subscription;
  restrictSearchToPayMarketCountry: boolean;

  selectedRecordSubscription: Subscription;
  selectedRowIds: number[];

  exportModalIsOpen = false;
  displaySecurityWarning = false;

  projectJobGrid$: Observable<DataGridState>;
  totalDataRows$: Observable<number>;
  userContext$: Observable<UserContext>;

  groupedColumnHeaderTemplates = {};

  companyFieldGroups = [
    'Company Allow',
    'Company Base',
    'Company Bonus',
    'Company Bonus Pct',
    'Company Bonus Target',
    'Company Bonus Target Pct',
    'Company Fixed',
    'Company LTIP',
    'Company Remun',
    'Company Target LTIP',
    'Company Target TDC',
    'Company TCC',
    'Company TCC Target',
    'Company TDC',
    'Company TGP',
  ];

  projectFieldFeatureImplementations = ProjectFieldManagementFeatureImplementations;

  constructor(private route: ActivatedRoute,
              private store: Store<fromPricingProjectReducer.State>,
              private pricingProjectHelperService: PricingProjectHelperService) {
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true
    };

    this.projectJobGrid$ = this.store.pipe(select(fromPfDataGridReducer.getGrid, PageViewIds.ProjectJobs));

    // TODO: When inputs are programmed in for projectExports, this should be only SELECTED rows.
    this.totalDataRows$ = this.store.pipe(select(fromPfDataGridReducer.getTotalCount, PageViewIds.ProjectJobs));
  }

  ngOnInit(): void {
    this.initRouterParams();
    this.projectSubscription = this.store.select(fromPricingProjectReducer.getPricingProject).subscribe(p => {
      this.projectContext = p;
    });
    this.filter = [{
      SourceName: 'UserSession_ID',
      Operator: '=',
      Values: [this.projectId]
    }];

    this.companySettingsSubscription = this.store.select(fromCompanySettingsReducer.getCompanySettings).subscribe(cs => {
      if (cs !== null && cs !== undefined) {
        this.displaySecurityWarning = cs.find(x => x.Key === 'FileDownloadSecurityWarning').Value === 'true';
        this.restrictSearchToPayMarketCountry = cs.find(x => x.Key === 'RestrictSurveySearchCountryFilterToPayMarket').Value === 'true' || false;

      }
    });

    this.userContext$ = this.store.select(fromRootState.getUserContext);

    this.selectedRecordSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, PageViewIds.ProjectJobs).subscribe(k => {
      if (k) {
        this.selectedRowIds = k;
      }
    });
  }

  ngOnDestroy() {
    this.companySettingsSubscription.unsubscribe();
    this.selectedRecordSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Job_Title': {Template: this.jobTitle},
      'comp': {Template: this.compColumn},
      'percentage': {Template: this.percentageColumn}
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate,
      ColumnChooserConfig: {
        ColumnChooserType: ColumnChooserType.Custom,
        ColumnChooserTemplate: this.customColumnChooser
      }
    };

    this.companyFieldGroups.forEach(group => {
      this.groupedColumnHeaderTemplates[group] = { Template: this.companyColumn };
    });
  }

  openExportModal(buttonElement): void {
    buttonElement.blur();

    if (this.displaySecurityWarning) {
      this.fileDownloadSecurityWarningModal.open();
    } else {
      this.exportModalIsOpen = true;
    }
  }

  closeExportModal(): void {
    this.exportModalIsOpen = false;
  }

  clearSelections() {
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(PageViewIds.ProjectJobs));
  }

  openMultiMatch() {
    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));

    const contextPayload: ProjectContext = {
      JobValues: this.selectedRowIds.map(x => x.toString()),
      ProjectId: this.projectId,
      RestrictToCountryCode: this.restrictSearchToPayMarketCountry,
      SearchContext: {
        PayMarketId: 0 // This comes over as empty string from classic ASP, which is treated as 0
      }
    };

    this.pricingProjectHelperService.SetProjectContext(contextPayload);
  }

  private initRouterParams(): void {
    this.projectId = this.route.snapshot.params.projectId;
  }

  jobSummaryClickHandler(): void {
    this.viewingJobSummary = !this.viewingJobSummary;
  }

  openAddDataModal(event, dataRows): void {
    const jobContext = {
      JobTitle: dataRows['vw_ProjectJobPayMarketMetadata_Job_Title'],
      JobPayMarketId: dataRows['vw_ProjectJobPayMarketMetadata_Paymarket'],
      CompanyJobId: dataRows['CompanyJobs_CompanyJob_ID'],
      JobCode: dataRows['vw_ProjectJobPayMarketMetadata_Job_Code'],
    };
    const searchContext = {
      PaymarketId: dataRows['CompanyPayMarkets_CompanyPayMarket_ID'],
      CurrencyCode: dataRows['vw_ProjectJobPayMarketMetadata_Currency'],
      ProjectId: dataRows['vw_ProjectJobPayMarketMetadata_UserSession_ID'],
      CountryCode: dataRows['vw_ProjectJobPayMarketMetadata_Country_Code'],
      RestrictToCountryCode: this.restrictSearchToPayMarketCountry,
      Rate: this.projectContext.Project.Rate
    };

    this.store.dispatch(new fromSearchFeatureActions.SetSearchFeatureId(SearchFeatureIds.AddSurveyData));
    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.pricingProjectHelperService.SetAddDataModalContext(jobContext, searchContext);

    event.stopPropagation();
  }

  handleColumnChooserClicked() {
    this.store.dispatch(new fromPricingProjectActions.GetProjectFieldsForColumnChooser({
      ProjectId: this.projectId,
      PageViewId: this.pageViewId
    }));
  }

  addJobClickHandler() {
    if (this.viewingJobSummary) {
      this.viewingJobSummary = false;
      return;
    }
    const payload = {
      PayMarketId: this.projectContext.ProjectPayMarket.Id,
      ProjectId: this.projectId
    };

    this.pricingProjectHelperService.SetAddJobsModalContext(payload);
  }
}
