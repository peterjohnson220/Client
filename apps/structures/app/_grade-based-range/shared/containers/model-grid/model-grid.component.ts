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

import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import { StructuresPagesService } from '../../../../shared/services';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromPublishModelModalActions from '../../../../shared/actions/publish-model-modal.actions';
import { ModelSettingsModalContentComponent } from '../model-settings-modal-content';
import * as fromGradeBasedSharedReducer from '../../reducers';

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
  @Input() isNewRangeOrCreateModelFlow = false;
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
      ExportSourceName: 'Grade Based Structures',
      CustomExportType: 'GradeBasedStructures',
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

  hideRowActionsGradeGrid(): boolean {
    if ((this.metaData?.IsCurrent && !this.hasAddEditDeleteStructurePermission) || (!this.metaData?.IsCurrent && !this.hasCreateEditStructureModelPermission)) {
      return true;
    } else {
      return false;
    }
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
    // We should dispatch this action only for Employees/Pricings pages
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

  buildForm() {
    this.modelSettingsForm = new FormGroup({
      'ModelName': new FormControl(!this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'Grades': new FormControl(this.numGrades || ''),
      'RangeDistributionTypeId': new FormControl({ value: this.metaData.RangeDistributionTypeId, disabled: true }, [Validators.required]),
      'MarketDataBased': new FormControl(this.controlPoint || 'BaseMRP', [Validators.required]),
      'StartingMidpoint': new FormControl(this.metaData.StartingMidpoint || '', [Validators.required]),
      'RangeSpread': new FormControl(this.metaData.SpreadMin || '', [Validators.required]),
      'MidpointProgression': new FormControl(this.metaData.MidpointProgression || '', [Validators.required]),
      'Rate': new FormControl(this.metaData.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metaData.Currency || 'USD', [Validators.required])
    });

    if (this.isNewModel) {
      this.setValidators('Grades');
      this.setValidators('StartingMidpoint');
      this.setValidators('RangeSpread');
      this.setValidators('MidpointProgression');
    } else {
      this.clearValidators('Grades');
      this.clearValidators('StartingMidpoint');
      this.clearValidators('RangeSpread');
      this.clearValidators('MidpointProgression');
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

  private setValidators(controlName: string) {
    this.modelSettingsForm.get(controlName).setValidators([Validators.required]);
    this.modelSettingsForm.get(controlName).updateValueAndValidity();
  }

  private clearValidators(controlName: string) {
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

        // Open Model Settings modal only if it's a new model flow
        if (this.isNewRangeOrCreateModelFlow && this.isNewModel) {
          this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
        }
      }
    });
    this.modalOpenSub = this.modalOpen$.subscribe(mo => {
      if (mo) {
        this.buildForm();
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
  }
}
