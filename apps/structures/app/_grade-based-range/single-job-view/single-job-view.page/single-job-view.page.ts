import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GradeBasedPageViewIds, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';

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
  @ViewChild('eeCount') employeesCountColumn: ElementRef;

  metadataSubscription: Subscription;
  roundingSettingsSub: Subscription;
  pagingOptionsSubscription: Subscription;
  dataSubscription: Subscription;

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

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.employeesPageViewId = PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId);
        this.dataCutsPageViewId = GradeBasedPageViewIds.DataCuts;
        this.jobPageViewId = PagesHelper.getJobsPageViewIdByRangeDistributionType(md.RangeDistributionTypeId);
        this.pageViewId = this.employeesPageViewId;
      }
    });
    this.queryParams = this.activatedRoute.snapshot.queryParams;
    this.rangeId = this.queryParams?.rangeId;
    this.rangeGroupId = this.router.url.split('/')[2];
    this.fromJobsView = this.queryParams?.jobsView === 'true' ? true : false;

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.jobPageViewId).subscribe(data => {
      if (data && this.rangeId) {
        this.jobTitle = data.data.find(x =>
          x.CompanyJobs_Structures_CompanyJobId === Number(this.activatedRoute.snapshot.params.id)).CompanyJobs_Structures_JobTitle;
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
        Values: [this.activatedRoute.snapshot.params.id]
      }
    ];

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };

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
    this.activeTab = 'DataCuts';
    this.pageViewId = this.dataCutsPageViewId;
    // TODO: the rest of this implementation as part of STRUC-608
    return false;
  }

  ngOnInit(): void {
    this.activeTab = 'Employees';
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'Employees_Per_Grade': {Template: this.employeesCountColumn},
      'Range_Spread': {Template: this.rangeSpreadFieldColumn},
      'GradeMidpointDiff': {Template: this.diffFieldColumn},
      [PfDataGridColType.noFormatting]: {Template: this.noFormattingColumn},
      [PfDataGridColType.rangeFieldEditor]: {Template: this.rangeFieldColumn},
      [PfDataGridColType.percentage]: {Template: this.percentageColumn},
      [PfDataGridColType.rangeValue]: {Template: this.rangeValueColumn}
    };
  }


  ngOnDestroy(): void {
    this.metadataSubscription.unsubscribe();
    this.pagingOptionsSubscription.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
