import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums';
import * as fromReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { GradeBasedPageViewIds, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { GetPricingsToModifyRequest } from 'libs/features/pricings/multi-match/models';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromModifyPricingsActions from 'libs/features/pricings/multi-match/actions';
import * as fromRootState from 'libs/state/state';
import { Permissions } from 'libs/constants';
import { MultiMatchFeatureImplementations } from 'libs/features/pricings/multi-match/constants';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { PagesHelper } from '../../../shared/helpers/pages.helper';


@Component({
  selector: 'pf-single-job-view-page',
  templateUrl: './single-job-view.page.html',
  styleUrls: ['./single-job-view.page.scss']
})

export class SingleJobViewPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('diffField') diffFieldColumn: ElementRef;
  @ViewChild('rangeField') rangeFieldColumn: ElementRef;
  @ViewChild('noFormatting', {static: true}) noFormattingColumn: ElementRef;
  @ViewChild('gridGlobalActions', {static: true}) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('percentage', {static: true}) percentageColumn: ElementRef;
  @ViewChild('rangeValue', {static: true}) rangeValueColumn: ElementRef;
  @ViewChild('rangeSpreadField') rangeSpreadFieldColumn: ElementRef;

  metadataSubscription: Subscription;
  roundingSettingsSub: Subscription;
  pagingOptionsSubscription: Subscription;
  dataSubscription: Subscription;
  companySettingsSubscription;

  metaData$: Observable<RangeGroupMetadata>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;

  pageViewId: string;
  jobPageViewId: string;
  employeesPageViewId: string;
  dataCutsPageViewId: string;
  filter: PfDataGridFilter[];
  actionBarConfig: ActionBarConfig;
  singleRecordActionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pfThemeType = PfThemeType;
  roundingSettings: RoundingSettingsDataObj;
  pagingOptions: PagingOptions;
  activeTab: string;
  filterTemplates = {};
  colTemplates = {};
  rangeType = RangeType.Grade;
  jobTitle = '';
  queryParams: any;
  rangeId: string;
  rangeGroupId: string;
  fromJobsView: boolean;
  pricingId: string;
  gradeRangeGroupData: any;
  companyJobId: string;
  metadata: RangeGroupMetadata;
  restrictSurveySearchToPaymarketCountry: boolean;
  _Permissions = null;
  multiMatchImplementation = MultiMatchFeatureImplementations.MODIFY_PRICINGS;
  hasStructuresPageFlagEnabled: boolean;

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasStructuresPageFlagEnabled = this.featureFlagService.enabled(FeatureFlags.StructuresPage, false);
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.metadata = md;
        this.employeesPageViewId = PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId);
        this.dataCutsPageViewId = GradeBasedPageViewIds.SingleJobDataCuts;
        this.jobPageViewId = PagesHelper.getJobsPageViewIdByRangeDistributionType(md.RangeDistributionTypeId);
        this.pageViewId = this.employeesPageViewId;
      }
    });
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.rangeId = this.queryParams?.rangeId;
    this.rangeGroupId = this.router.url.split('/')[2];
    this.fromJobsView = this.queryParams?.jobsView === 'true' ? true : false;
    this.companyJobId = this.activatedRoute.snapshot.params.id;

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.jobPageViewId).subscribe(data => {
      if (data && this.rangeId) {
        this.gradeRangeGroupData = data.data.find(x =>
          x.CompanyJobs_Structures_CompanyJobId === Number(this.activatedRoute.snapshot.params.id));
        this.jobTitle = this.gradeRangeGroupData?.CompanyJobs_Structures_JobTitle;
        this.pricingId = this.gradeRangeGroupData?.CompanyJobs_Pricings_CompanyJobPricing_ID;
      }
    });

    this.companySettingsSubscription = this.store.select(fromRootState.getCompanySettings).subscribe(cs => {
      if (cs) {
        this.restrictSurveySearchToPaymarketCountry = cs.find(x => x.Key
          === 'RestrictSurveySearchCountryFilterToPayMarket').Value === 'true';
      }
    });

    this.filter = [
      {
        SourceName: 'CompanyStructuresRanges_ID',
        Operator: '=',
        Values: [this.rangeId]
      },
      {
        SourceName: 'CompanyJobId',
        Operator: '=',
        Values: [this.companyJobId]
      }
    ];

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };

    this._Permissions = Permissions;

    this.singleRecordActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };

    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };

    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));

    this.pagingOptionsSubscription = this.store.select(fromReducer.getPagingOptions, this.pageViewId)
      .subscribe(pagingOptions => this.pagingOptions = pagingOptions);
  }

  get buttonText() {
    return this.fromJobsView ? 'Return to Jobs' : 'Return to Employees';
  }

  public get rangeRecalculationType(): typeof RangeRecalculationType {
    return RangeRecalculationType;
  }

  getRefreshFilter(dataRow: any): DataViewFilter {
    // @ts-ignore
    return [{
      EntitySourceName: 'CompanyJobs_Structures',
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID]
      },
      {
        SourceName: 'CompanyJobId',
        Operator: '=',
        Values: [dataRow.CompanyJobs_Structures_CompanyJobId]
      }
    ];
  }

  onEmployeesClicked() {
    this.activeTab = 'Employees';
    this.pageViewId = this.employeesPageViewId;
    return false;
  }

  onDataCutsClicked() {
    this.store.dispatch(new fromPfDataGridActions.SetFilterPanelDisplay(this.pageViewId, false));
    this.activeTab = 'DataCuts';
    this.pageViewId = this.dataCutsPageViewId;
    return false;
  }

  modifyPricings() {
    const pricingPayload = {
      PricingId: this.gradeRangeGroupData.CompanyJobs_Pricings_CompanyJobPricing_ID,
      JobId: this.gradeRangeGroupData.CompanyJobs_CompanyJob_ID,
      PaymarketId: this.metadata.PaymarketId
    };

    const payload: GetPricingsToModifyRequest = {
      Pricings: [pricingPayload],
      RestrictSearchToPayMarketCountry: this.restrictSurveySearchToPaymarketCountry
    };

    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchPageActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.store.dispatch(new fromModifyPricingsActions.GetPricingsToModify(payload));
  }

  ngOnInit(): void {
    this.activeTab = 'Employees';
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'Range_Spread': {Template: this.rangeSpreadFieldColumn},
      'GradeMidpointDiff': {Template: this.diffFieldColumn},
      [PfDataGridColType.noFormatting]: {Template: this.noFormattingColumn},
      [PfDataGridColType.rangeFieldEditor]: {Template: this.rangeFieldColumn},
      [PfDataGridColType.percentage]: {Template: this.percentageColumn},
      [PfDataGridColType.rangeValue]: {Template: this.rangeValueColumn}
    };
  }

  matchModalSaved() {
    if (this.activeTab === 'DataCuts') {
      this.store.dispatch(new fromPfDataGridActions.LoadData(this.dataCutsPageViewId));
    }
  }

  ngOnDestroy(): void {
    this.metadataSubscription.unsubscribe();
    this.pagingOptionsSubscription.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.companySettingsSubscription.unsubscribe();
  }
}
