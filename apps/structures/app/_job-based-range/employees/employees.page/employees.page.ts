import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RangeGroupMetadata } from 'libs/models/structures';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { Permissions } from 'libs/constants';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { Between } from 'libs/ui/formula-editor/models';

import * as fromSharedStructuresReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromDuplicateModelModalActions from '../../shared/actions/duplicate-model-modal.actions';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import { StructuresPagesService } from '../../../shared/services';
import * as fromSharedStructuresActions from '../../../shared/actions/shared.actions';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;
  @ViewChild('date', { static: true }) dateColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  metaData: RangeGroupMetadata;
  metadataSubscription: Subscription;
  dataSubscription: Subscription;
  colTemplates = {};
  modelPageFilter: PfDataGridFilter[];
  filter: PfDataGridFilter[];
  pageViewId: string;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;
  modelPageViewId: string;
  modelPageViewIdSubscription: Subscription;
  pfThemeType = PfThemeType;
  groupFieldSelected = false;
  selectedFieldsSubscription: Subscription;
  filterQuery: string;
  filterValue: string;
  modelData: GridDataResult;
  routerParamsSubscription: Subscription;

  gridConfig: GridConfig;
  filterTemplates = {};
  sourceNames = {
    Base: 'BaseSalaryCalculatedStructureRangeGroup',
    Bonus: 'BonusCalculatedStructureRangeGroup',
    BonusPct: 'BonusPct',
    BonusTarget: 'Bonus_TargetCalculatedStructureRangeGroup',
    BonusTargetPct: 'BonusTargetPct',
    TCC: 'TCCCalculatedStructureRangeGroup',
    TCCTarget: 'TargetTCCCalculatedStructureRangeGroup',
    LTIP: 'LTICalculatedStructureRangeGroup',
    TargetLTIP: 'TargetLTIPCalculatedStructureRangeGroup',
    TDC: 'TDCCalculatedStructureRangeGroup',
    TargetTDC: 'TargetTDCCalculatedStructureRangeGroup',
    Allow: 'AllowCalculatedStructureRangeGroup',
    Fixed: 'FixedCalculatedStructureRangeGroup',
    TGP: 'TGPCalculatedStructureRangeGroup',
    Remun: 'RemunCalculatedStructureRangeGroup'
  };

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    public route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.metaData = md;
        this.pageViewId = PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId);
      }
    });

    this.rangeGroupId = this.route.parent.snapshot.params.id;
    this.rangeId = parseInt(this.route.snapshot.params.id, 10);
    

    this.modelPageFilter = this.filter = [{
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Values: [this.route.snapshot.params.id]
    }];

    this.routerParamsSubscription = this.route.queryParams.subscribe(params => {
      this.filterQuery = params['filterQuery'] ?? null;
      if (this.filterQuery == null) {
        this.filter = this.modelPageFilter;
      } else {
        this.filterValue = params['value'] ?? null;

        if(!!this.modelData) {
          this.filter = this.getFilter();
        }
        
        if(!!this.filterValue) {
            this.filter = this.getFilter();
        }
      }
    });
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };

    this._Permissions = Permissions;
    this.modelPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelPageViewId = pv);
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };

    this.selectedFieldsSubscription = this.store.select(fromPfGridReducer.getFields, this.modelPageViewId).subscribe(fields => {
      if (fields) {
        const anyGroupField = fields.find(f => f.Group && f.IsSelected);
        this.groupFieldSelected = !!anyGroupField;
      }
    });

    this.dataSubscription = this.store.select(fromPfGridReducer.getData, this.modelPageViewId).subscribe(data => {
      if (data) {
        this.modelData = data;
        if (this.filterQuery != null && !this.filterValue) {
          this.filter = this.getFilter();          
        }
      }
    });
  }

  private getFilter() {
    const payType = this.metaData.PayType;
    const rangeDistributionTypeId = this.metaData.RangeDistributionTypeId;
    const filter = [
      {
        SourceName: 'CompanyStructuresRanges_ID',
        Operator: '=',
        Values: [this.route.snapshot.params.id]
      }];

    const sourceName = this.getSourceName(payType);
    if (this.filterQuery === 'minOutlier') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: '<',
          Values: [this.filterValue ?? this.modelData.data[0]['CompanyStructures_Ranges_Min']]
        });
    }

    if (this.filterQuery === 'maxOutlier') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: '>',
          Values: [this.filterValue ?? this.modelData.data[0]['CompanyStructures_Ranges_Max']]
        });
    }

    if (this.filterQuery === 'q1') {
      const value = rangeDistributionTypeId === 1
        ? (this.modelData.data[0]['CompanyStructures_Ranges_Min'] + this.modelData.data[0]['CompanyStructures_Ranges_Mid']) / 2
        : this.modelData.data[0]['CompanyStructures_Ranges_Quartile_First'];

      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Min'], value]
        });
    }

    if (this.filterQuery === 'q2') {
      const value = rangeDistributionTypeId === 1
        ? (this.modelData.data[0]['CompanyStructures_Ranges_Min'] + this.modelData.data[0]['CompanyStructures_Ranges_Mid']) / 2
        : this.modelData.data[0]['CompanyStructures_Ranges_Quartile_First'];

      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [value, this.modelData.data[0]['CompanyStructures_Ranges_Mid']]
        });
    }

    if (this.filterQuery === 'q3') {
      const value = rangeDistributionTypeId === 1
        ? (this.modelData.data[0]['CompanyStructures_Ranges_Mid'] + this.modelData.data[0]['CompanyStructures_Ranges_Max']) / 2
        : this.modelData.data[0]['CompanyStructures_Ranges_Quartile_Second'];

      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Mid'], value]
        });
    }

    if (this.filterQuery === 'q4') {
      const value = rangeDistributionTypeId === 1
        ? (this.modelData.data[0]['CompanyStructures_Ranges_Mid'] + this.modelData.data[0]['CompanyStructures_Ranges_Max']) / 2
        : this.modelData.data[0]['CompanyStructures_Ranges_Quartile_Second'];

      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [value, this.modelData.data[0]['CompanyStructures_Ranges_Max']]
        });
    }

    if (this.filterQuery === '1st5th') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Min'], this.modelData.data[0]['CompanyStructures_Ranges_Quintile_First']]
        });
    }

    if (this.filterQuery === '2nd5th') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Quintile_First'], this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Second']]
        });
    }

    if (this.filterQuery === '3rd5th') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Second'], this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Third']]
        });
    }

    if (this.filterQuery === '4th5th') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Third'], this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Fourth']]
        });
    }

    if (this.filterQuery === 'last5th') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Quintile_Fourth'], this.modelData.data[0]['CompanyStructures_Ranges_Tertile_Max']]
        });
    }

    if (this.filterQuery === '1st3rd') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Min'], this.modelData.data[0]['CompanyStructures_Ranges_Tertile_First']]
        });
    }

    if (this.filterQuery === '2nd3rd') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Tertile_First'], this.modelData.data[0]['CompanyStructures_Ranges_Tertile_Second']]
        });
    }

    if (this.filterQuery === 'last3rd') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.modelData.data[0]['CompanyStructures_Ranges_Tertile_Second'], this.modelData.data[0]['CompanyStructures_Ranges_Max']]
        });
    }

    return filter;
  }

  private getSourceName(payType: string) {
    let sourceName = this.sourceNames[payType];
    if (sourceName == null) {
      sourceName = this.sourceNames['Base'];
    }

    return sourceName;
  }

  // Events
  handleModelSettingsBtnClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  handleDuplicateModelBtnClicked() {
    this.store.dispatch(new fromDuplicateModelModalActions.OpenModal());
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn },
      [PfDataGridColType.date]: { Template: this.dateColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn }
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };

    // Get all overridden ranges
    this.store.dispatch(new fromSharedStructuresActions.GetOverriddenRanges({
      pageViewId: this.modelPageViewId,
      rangeGroupId: this.rangeGroupId
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
    this.modelPageViewIdSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.routerParamsSubscription.unsubscribe();
  }
}
