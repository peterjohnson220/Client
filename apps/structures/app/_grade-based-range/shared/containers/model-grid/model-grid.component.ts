import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { SortDescriptor } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { delay } from 'rxjs/operators';

import {
  ActionBarConfig,
  ColumnChooserType,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridConfig,
  GridRowActionsConfig,
  PfDataGridFilter
} from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { CompanyStructureRangeOverride, RangeGroupMetadata, RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { PermissionService } from 'libs/core/services';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { AdjustMidpointTypes } from 'libs/constants/structures/adjust-midpoint-type';

import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import { StructuresPagesService } from '../../../../shared/services';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromPublishModelModalActions from '../../../../shared/actions/publish-model-modal.actions';
import * as fromDuplicateModelModalActions from '../../../../shared/actions/duplicate-model-modal.actions';
import { ModelSettingsModalContentComponent } from '../model-settings-modal-content';
import * as fromGradeBasedSharedReducer from '../../reducers';
import { ChartSvg } from '../../models';

@Component({
  selector: 'pf-grade-based-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss']
})
export class ModelGridComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mid') midColumn: ElementRef;
  @ViewChild('eeCount') eeCountColumn: ElementRef;
  @ViewChild('diffField') diffFieldColumn: ElementRef;
  @ViewChild('rangeField') rangeFieldColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('rangeValue', { static: true }) rangeValueColumn: ElementRef;
  @ViewChild('rangeSpreadField') rangeSpreadFieldColumn: ElementRef;
  @ViewChild('jobsCount') jobsCountColumn: ElementRef;
  @ViewChild(ModelSettingsModalContentComponent, { static: false }) public modelSettingsModalContentComponent: ModelSettingsModalContentComponent;

  @Input() singleRecordView: boolean;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() rangeGroupId: number;
  @Input() modelGridPageViewId: string;
  @Input() modelSummaryPageViewId: string;
  @Input() reorderable: boolean;
  @Input() saveSort = false;
  @Input() modifiedKey: string = null;
  @Input() allowMultipleSort: boolean;
  @Input() isNewRangeFlow = false;
  @Input() isCreateModelFlow = false;
  @Output() manageModelClicked = new EventEmitter();

  pfThemeType = PfThemeType;
  permissions = Permissions;

  metaData$: Observable<RangeGroupMetadata>;
  selectedRecordId$: Observable<number>;

  singleRecordActionBarConfig: ActionBarConfig;
  singleGridConfig: GridConfig;
  gridConfig: GridConfig;
  colTemplates = {};
  isSummaryCollapsed: boolean;
  isRangeChartCollapsed: boolean;
  defaultSort: SortDescriptor[];
  defaultPagingOptions: PagingOptions;
  fullGridActionBarConfig: ActionBarConfig;
  rangeType = RangeType.Grade;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;
  roundingSettings: RoundingSettingsDataObj;
  metaData: RangeGroupMetadata;
  metaDataSub: Subscription;
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  rangeOverrides$: Observable<CompanyStructureRangeOverride[]>;
  rangeOverridesSub: Subscription;
  rangeOverrides: CompanyStructureRangeOverride[];
  selectedDropdown: NgbDropdown;
  filterTemplates = {};
  isNewModel: boolean;
  modelSettingsForm: FormGroup;
  numGrades: number;
  dataSubscription: Subscription;
  data$: Observable<GridDataResult>;
  pageViewId: string;
  pageViewIdSub: Subscription;
  modalOpenSub: Subscription;
  modalOpen$: Observable<boolean>;
  controlPoint: string;
  gradesDetailsSub: Subscription;
  summaryChartSvgSub: Subscription;
  verticalChartSvgSub: Subscription;
  summaryChartSvg$: Observable<string>;
  verticalChartSvg$: Observable<string>;
  chartSvgs: ChartSvg[] = [];

  hasAddEditDeleteStructurePermission: boolean;
  hasCreateEditStructureModelPermission: boolean;
  hasCanEditPublishedStructureRanges: boolean;

  constructor(
    public store: Store<any>,
    private permissionService: PermissionService,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));
    this.rangeOverrides$ = this.store.pipe(select(fromSharedStructuresReducer.getRangeOverrides));
    this.pageViewIdSub = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.modelGridPageViewId);
    this.data$ = this.store.select(fromPfGridReducer.getData, this.pageViewId);
    this.modalOpen$ = this.store.pipe(select(fromSharedStructuresReducer.getModelSettingsModalOpen), delay(0));
    this.summaryChartSvg$ = this.store.pipe(select(fromGradeBasedSharedReducer.getSummaryChartSvg));
    this.verticalChartSvg$ = this.store.pipe(select(fromGradeBasedSharedReducer.getVerticalChartSvg));
    this.singleRecordActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
    this.fullGridActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: true,
      ExportSourceName: 'Grade Range Structures',
      CustomExportType: 'GradeRangeStructures',
      ColumnChooserType: ColumnChooserType.Hybrid,
      EnableGroupSelectAll: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: false,
      ScrollToTop: true
    };
    this.defaultSort = [{
      dir: 'asc',
      field: 'CompanyStructures_Ranges_Mid'
    }];
    this.defaultPagingOptions = {
      From: 0,
      Count: 50
    };
  }

  initPermissions() {
    this.hasAddEditDeleteStructurePermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_ADD_EDIT_DELETE],
      PermissionCheckEnum.Single);
    this.hasCreateEditStructureModelPermission = this.permissionService.CheckPermission([Permissions.STRUCTURES_CREATE_EDIT_MODEL],
      PermissionCheckEnum.Single);
    this.hasCanEditPublishedStructureRanges = this.permissionService.CheckPermission([Permissions.STRUCTURES_PUBLISH],
      PermissionCheckEnum.Single);
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
    // Update metadata for GBR range group and if index equals 0
    // Because we need to update Starting Midpoint for Model Settings
    if (metaInfo.rangeType === RangeType.Grade && metaInfo.rowIndex === 0) {
      store.dispatch(new fromSharedStructuresActions.SetMetadata(metaInfo.metaData));
    }
  }

  showRevertChanges(rangeId: number): boolean {
    if (this.rangeOverrides) {
      const currentOverride = this.rangeOverrides.find(o => o.CompanyStructuresRangesId === rangeId);
      if (!!currentOverride) {
        return this.isManualOverride(currentOverride);
      }
    } else {
      return false;
    }
  }

  isManualOverride(dto: CompanyStructureRangeOverride): boolean {
    return dto.Max || dto.Min || dto.Mid || dto.FirstTertile || dto.SecondTertile || dto.FirstQuartile || dto.SecondQuartile || dto.FirstQuintile
      || dto.SecondQuintile || dto.ThirdQuintile || dto.FourthQuintile || dto.RangeSpread || dto.MidDiffPercent;
  }

  revertChanges(dataRow: any, rowIndex: number) {
    this.store.dispatch(new fromSharedStructuresActions.RevertingRangeChanges({
      pageViewId: this.modelGridPageViewId,
      rangeId: dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID,
      rangeGroupId: dataRow.CompanyStructures_RangeGroup_CompanyStructuresRangeGroup_ID,
      rowIndex: rowIndex,
      refreshRowDataViewFilter: this.getRefreshFilter(dataRow)
    }));
  }

  scroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  handleSelectedRowAction(dropdown: any) {
    this.selectedDropdown = dropdown;
  }

  public get rangeRecalculationType(): typeof RangeRecalculationType {
    return RangeRecalculationType;
  }

  handleManageModelClicked() {
    this.manageModelClicked.emit();
  }

  handleModelSettingsClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  handlePublishModelClicked() {
    this.store.dispatch(new fromPublishModelModalActions.OpenModal());
  }

  handleDuplicateModelBtnClicked() {
    this.store.dispatch(new fromDuplicateModelModalActions.OpenModal());
  }

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl(!this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'Grades': new FormControl(this.numGrades || ''),
      'RangeDistributionTypeId': new FormControl({ value: this.metaData.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'MarketDataBased': new FormControl(this.controlPoint || 'BaseMRP', [Validators.required]),
      'StartingMidpoint': new FormControl(this.metaData.StartingMidpoint || ''),
      'RangeSpread': new FormControl(this.metaData.SpreadMin || ''),
      'MidpointProgression': new FormControl(this.metaData.MidpointProgression || ''),
      'Rate': new FormControl(this.metaData.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metaData.Currency || 'USD', [Validators.required]),
      'AdjustMidpointSetting': new FormGroup({
        'Type': new FormControl(AdjustMidpointTypes.NoChange),
        'Percentage': new FormControl({ value: '', disabled: true })
      })
    });

    if (!this.metaData.IsCurrent) {
      this.setRequiredValidator('RangeSpread');
      this.setRequiredValidator('MidpointProgression');
    }

    this.store.dispatch(new fromModelSettingsModalActions.SetActiveTab('modelTab'));
  }

  handleModalSubmit() {
    this.modelSettingsModalContentComponent.handleModalSubmit();
  }

  handleModelAttemptedSubmit() {
    this.modelSettingsModalContentComponent.handleModalSubmitAttempt();
  }

  handleModalDismissed() {
    this.modelSettingsModalContentComponent.handleModalDismiss();
  }

  handleAdjustMidpointRadioButtonChanged(event: any) {
    this.clearValidators('AdjustMidpointSetting.Percentage');
    if (event.target.id === 'AdjustMidpointMoveBy') {
      this.setValidators('AdjustMidpointSetting.Percentage', 0.01, 300);
    }
  }

  private setRequiredValidator(controlName: string) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private setValidators(controlName: string, min: number, max: number) {
    this.modelSettingsForm.get(controlName).enable();
    this.modelSettingsForm.get(controlName).setValidators([Validators.required, Validators.min(min), Validators.max(max)]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
    this.modelSettingsForm.get(controlName).disable();
    this.modelSettingsForm.get(controlName).clearValidators();
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = {
      'Mid': { Template: this.midColumn },
      'Employees_Per_Grade': { Template: this.eeCountColumn },
      'Jobs_Per_Grade': { Template: this.jobsCountColumn },
      'Range_Spread': { Template: this.rangeSpreadFieldColumn },
      'GradeMidpointDiff': { Template: this.diffFieldColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn },
      [PfDataGridColType.rangeFieldEditor]: { Template: this.rangeFieldColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn },
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn }
    };

    this.fullGridActionBarConfig = {
      ...this.fullGridActionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate,
      Title: '',
      CustomClass: ['overflow-visible']
    };
  }

  ngOnInit(): void {
    this.metaDataSub = this.metaData$.subscribe(md => {
      if (md) {
        this.metaData = md;
        this.controlPoint = this.metaData?.PayType ? this.metaData.PayType + 'MRP' : 'BaseMRP';
      }
    });
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
    this.rangeOverridesSub = this.rangeOverrides$.subscribe(ro => this.rangeOverrides = ro);
    this.gradesDetailsSub = this.store.select(fromGradeBasedSharedReducer.getGradesDetails).subscribe(details => {
      if (details?.obj?.length > 0) {
        this.numGrades = details.obj.length;
      }
    });
    this.dataSubscription = this.data$.subscribe(data => {
      if (data) {
        this.isNewModel = data.total < 1 ? true : false;
        // Open Model Settings modal only if it's a new model flow or create model flow
        if (this.isNewRangeFlow && this.isNewModel || this.isCreateModelFlow) {
          this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
        }
      }
    });
    this.modalOpenSub = this.modalOpen$.subscribe(mo => {
      if (mo) {
        this.buildForm();
      }
    });
    this.summaryChartSvgSub = this.summaryChartSvg$.subscribe(scs => {
      if (scs) {
        // look for existing value
        const svg = this.chartSvgs.find(s => s.ChartName === 'Summary');
        if (!!svg) {
          this.chartSvgs[this.chartSvgs.indexOf(svg)].Svg = scs;
        } else {
          this.chartSvgs.push({ ChartName: 'Summary', Svg: scs });
        }
      }
    });
    this.verticalChartSvgSub = this.verticalChartSvg$.subscribe(vcs => {
      if (vcs) {
        // look for existing value
        const svg = this.chartSvgs.find(s => s.ChartName === 'Vertical');
        if (!!svg) {
          this.chartSvgs[this.chartSvgs.indexOf(svg)].Svg = vcs;
        } else {
          this.chartSvgs.push({ ChartName: 'Vertical', Svg: vcs });
        }
      }
    });
    this.initPermissions();
    this.buildForm();
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy(): void {
    this.metaDataSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.rangeOverridesSub.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.pageViewIdSub.unsubscribe();
    this.modalOpenSub.unsubscribe();
    this.gradesDetailsSub.unsubscribe();
    this.verticalChartSvgSub.unsubscribe();
    this.summaryChartSvgSub.unsubscribe();
  }
}
