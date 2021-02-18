import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { GradeBasedPageViewIds, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as fromActions from 'libs/features/grids/pf-data-grid/actions';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import { PagesHelper } from '../../../shared/helpers/pages.helper';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss']
})
export class JobsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mid') midColumn: ElementRef;
  @ViewChild('eeCount') eeCountColumn: ElementRef;
  @ViewChild('diffField') diffFieldColumn: ElementRef;
  @ViewChild('rangeField') rangeFieldColumn: ElementRef;
  @ViewChild('noFormatting', {static: true}) noFormattingColumn: ElementRef;
  @ViewChild('gridGlobalActions', {static: true}) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('percentage', {static: true}) percentageColumn: ElementRef;
  @ViewChild('rangeValue', {static: true}) rangeValueColumn: ElementRef;
  @ViewChild('rangeSpreadField') rangeSpreadFieldColumn: ElementRef;
  @ViewChild('eeCount') employeesCountColumn: ElementRef;

  employeesPageViewId: string;
  dataCutsPageViewId: string;
  modelGridPageViewId: string;
  pageViewId: string;
  metaData$: Observable<RangeGroupMetadata>;
  metadataSubscription: Subscription;
  actionBarConfig: ActionBarConfig;
  singleRecordActionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pfThemeType = PfThemeType;
  rangeGroupId: number;
  rangeId: number;
  colTemplates = {};
  rangeType = RangeType.Grade;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;
  roundingSettings: RoundingSettingsDataObj;
  gradeName = '';

  activeTab: string;
  filter: PfDataGridFilter;

  modelGridPageViewIdSubscription: Subscription;
  dataSubscription: Subscription;

  filterTemplates = {};

  constructor(public store: Store<fromSharedStructuresReducer.State>,
              public route: ActivatedRoute,
              private structuresPagesService: StructuresPagesService) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.employeesPageViewId = PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId);
        this.dataCutsPageViewId = GradeBasedPageViewIds.DataCuts;
        this.pageViewId = this.employeesPageViewId;
      }
    });

    this.modelGridPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.modelGridPageViewId).subscribe(data => {
      if (data) {
        this.gradeName = data.data[0].CompanyStructures_Ranges_Grade_Name;
      }
    });

    this.rangeGroupId = this.route.parent.snapshot.params.id;
    this.rangeId = parseInt(this.route.snapshot.params.id, 10);

    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [this.route.snapshot.params.id]
    };

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
  }

  onEmployeesClicked() {
    this.activeTab = 'Employees';
    this.pageViewId = this.employeesPageViewId;
    return false;
  }

  onDataCutsClicked() {
    // TODO this is Employees implementation - we need to change this in the future

    // Close filter
    this.store.dispatch(new fromActions.SetFilterPanelDisplay(this.pageViewId, false));
    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [this.route.snapshot.params.id]
    };

    this.activeTab = 'DataCuts';
    this.pageViewId = this.dataCutsPageViewId;

    // Update inbound filters
    this.store.dispatch(new fromActions.UpdateInboundFilters(this.pageViewId, [this.filter]));

    return false;
  }

  public get rangeRecalculationType(): typeof RangeRecalculationType {
    return RangeRecalculationType;
  }

  getRefreshFilter(dataRow: any): DataViewFilter {
    return {
      EntitySourceName: 'CompanyStructures_Ranges',
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID]
    };
  }

  updateMidSuccessCallbackFn(store: Store<any>, metaInfo: any) {
    // We should dispatch this action only for Employees/Pricings pages
  }

  // Lifecycle
  ngOnInit(): void {
    this.activeTab = 'Employees';
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      'Mid': {Template: this.midColumn},
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
    this.modelGridPageViewIdSubscription.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
