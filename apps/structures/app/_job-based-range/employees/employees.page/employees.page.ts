import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

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
import * as fromDuplicateModelModalActions from '../../../shared/actions/duplicate-model-modal.actions';
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
  filterMinValue: string;
  filterMaxValue: string;
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
        this.filterMinValue = params['minValue'] ?? null;
        this.filterMaxValue = params['maxValue'] ?? null;

        if (!!this.filterValue || (!!this.filterMinValue && !!this.filterMaxValue)) {
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
  }

  private getFilter() {
    const payType = this.metaData.PayType;
    const filter = [
      {
        SourceName: 'CompanyStructuresRanges_ID',
        Operator: '=',
        Values: [this.route.snapshot.params.id]
      }];

    const sourceName = this.getSourceName(payType);
    if (this.filterQuery === 'minOutlier' || this.filterQuery === 'maxOutlier') {
      const filterOperator = this.filterQuery === 'minOutlier' ? '<' : '>';
      filter.push(
        {
          SourceName: sourceName,
          Operator: filterOperator,
          Values: [this.filterValue]
        });
    }

    if (this.filterQuery === 'q1' || this.filterQuery === 'q2' || this.filterQuery === 'q3' || this.filterQuery === 'q4'
      || this.filterQuery === '1st5th' || this.filterQuery === '2nd5th'
      || this.filterQuery === '3rd5th' || this.filterQuery === '4th5th' || this.filterQuery === 'last5th'
      || this.filterQuery === '1st3rd' || this.filterQuery === '2nd3rd' || this.filterQuery === 'last3rd') {
      filter.push(
        {
          SourceName: sourceName,
          Operator: Between.Value,
          Values: [this.filterMinValue, this.filterMaxValue]
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
    this.routerParamsSubscription.unsubscribe();
  }
}
