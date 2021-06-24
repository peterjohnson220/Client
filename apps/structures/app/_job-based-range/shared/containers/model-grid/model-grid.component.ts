import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import cloneDeep from 'lodash/cloneDeep';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ofType } from '@ngrx/effects';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { delay } from 'rxjs/operators';

import {
  ActionBarConfig,
  ColumnChooserType,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig,
  GridRowActionsConfig,
  PfDataGridFilter,
  GridConfig
} from 'libs/features/grids/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import {
  CompanyStructureRangeOverride,
  RoundingSettingsDataObj,
  RangeGroupMetadata,
  JobBasedPageViewIds
} from 'libs/models/structures';
import { DataViewFilter, ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AsyncStateObj } from 'libs/models/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PermissionService } from 'libs/core/services';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { RangeType } from 'libs/constants/structures/range-type';
import { RangeRecalculationType } from 'libs/constants/structures/range-recalculation-type';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import * as fromPublishModelModalActions from '../../../../shared/actions/publish-model-modal.actions';
import * as fromDuplicateModelModalActions from '../../../../shared/actions/duplicate-model-modal.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import * as fromSharedStructuresReducer from '../../../../shared/reducers';
import * as fromSharedStructuresActions from '../../../../shared/actions/shared.actions';
import * as fromModelSettingsModalActions from '../../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { StructuresPagesService, UrlService } from '../../../../shared/services';
import { ModelSettingsModalContentComponent } from '../model-settings-modal-content';
import { Workflow } from '../../../../shared/constants/workflow';
import { SelectedPeerExchangeModel } from '../../../../shared/models';

@Component({
  selector: 'pf-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss', '../../styles/pf-data-grid-styles.scss']
})
export class ModelGridComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mid') midColumn: ElementRef;
  @ViewChild('rangeField') rangeFieldColumn: ElementRef;
  @ViewChild('eeCount') eeCountColumn: ElementRef;
  @ViewChild('eeCountWithFilter') eeCountWithFilterColumn: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;
  @ViewChild('noFormattingInfoCircle', { static: true }) noFormattingInfoCircleColumn: ElementRef;
  @ViewChild('mrpValue') mrpValueColumn: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('overrideFilter') overrideFilter: ElementRef;
  @ViewChild(ModelSettingsModalContentComponent, { static: false }) public modelSettingsModalContentComponent: ModelSettingsModalContentComponent;
  @Input() singleRecordView: boolean;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() rangeGroupId: number;
  @Input() pageViewId: string;
  @Input() reorderable: boolean;
  @Input() saveSort = false;
  @Input() modifiedKey: string = null;
  @Input() allowMultipleSort = false;
  @Input() compactGridMinHeight: string = null;
  @Output() addJobs = new EventEmitter();
  @Output() publishModel = new EventEmitter();
  @Output() openModelSettings = new EventEmitter();
  @Output() compareModelClicked = new EventEmitter();

  permissions = Permissions;

  showRemoveRangeModal = new BehaviorSubject<boolean>(false);
  showRemoveRangeModal$ = this.showRemoveRangeModal.asObservable();
  removingRange$: Observable<AsyncStateObj<boolean>>;
  removingRangeSuccessSubscription = new Subscription;
  rangeIdToRemove: number;

  pfThemeType = PfThemeType;
  metaData$: Observable<RangeGroupMetadata>;
  metaDataSub: Subscription;
  rangeOverrides$: Observable<CompanyStructureRangeOverride[]>;
  rangeOverridesSub: Subscription;
  selectedRecordId$: Observable<number>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;
  roundingSettings: RoundingSettingsDataObj;
  metaData: RangeGroupMetadata;
  colTemplates = {};
  modelPageViewId: string;
  modelPageViewIdSubscription: Subscription;
  rangeType = RangeType.Job;
  defaultPagingOptions: PagingOptions;
  defaultSort: SortDescriptor[];
  singleRecordActionBarConfig: ActionBarConfig;
  fullGridActionBarConfig: ActionBarConfig;
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();
  fieldsToShowValueOnly: string[] = ['OverrideMessage'];
  invalidMidPointRanges: number[];
  hasAddEditDeleteStructurePermission: boolean;
  hasCreateEditStructureModelPermission: boolean;
  hasCanEditPublishedStructureRanges: boolean;
  filterTemplates = {};
  modifiedKeys: any[];
  modifiedKeysSubscription: Subscription;
  selectedDropdown: NgbDropdown;
  rangeOverrides: CompanyStructureRangeOverride[];

  gridConfig: GridConfig;
  currentRangeGroup: any;
  currentRangeGroupId: number;
  currentRangeGroupName: any;
  compareFlag: boolean;
  currentRangeGroup$: Observable<AsyncStateObj<any>>;
  currentRangeGroupSub: Subscription;
  selectedOverrideMessage: any;
  overrideField: ViewField;
  gridFieldSubscription: Subscription;
  distinctOverrideMessages$: Observable<string[]>;
  distinctOverrideMessagesSub: Subscription;
  distinctOverrideMessages: string[];
  modelSettingsForm: FormGroup;
  isNewModel: boolean;
  modalOpen$: Observable<boolean>;
  modalOpenSub: Subscription;
  selectedPeerExchangeSub: Subscription;
  selectedPeerExchange$: Observable<SelectedPeerExchangeModel>;
  selectedExchange: SelectedPeerExchangeModel;
  eeCountQueryFilters = {
    CompanyStructures_RangeGroup_CountEEMinOutlier: 'minOutlier',
    CompanyStructures_RangeGroup_CountEEQ1: 'q1',
    CompanyStructures_RangeGroup_CountEEQ2: 'q2',
    CompanyStructures_RangeGroup_CountEEQ3: 'q3',
    CompanyStructures_RangeGroup_CountEEQ4: 'q4',
    CompanyStructures_RangeGroup_CountEE1st5th: '1st5th',
    CompanyStructures_RangeGroup_CountEE2nd5th: '2nd5th',
    CompanyStructures_RangeGroup_CountEE3rd5th: '3rd5th',
    CompanyStructures_RangeGroup_CountEE4th5th: '4th5th',
    CompanyStructures_RangeGroup_CountEELast5th: 'last5th',
    CompanyStructures_RangeGroup_CountEE1st3rd: '1st3rd',
    CompanyStructures_RangeGroup_CountEE2nd3rd: '2nd3rd',
    CompanyStructures_RangeGroup_CountEELast3rd: 'last3rd',
    CompanyStructures_RangeGroup_CountEEMaxOutlier: 'maxOutlier'
  };

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private actionsSubject: ActionsSubject,
    private permissionService: PermissionService,
    private structuresPagesService: StructuresPagesService,
    public urlService: UrlService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.modalOpen$ = this.store.pipe(select(fromSharedStructuresReducer.getModelSettingsModalOpen), delay(0));
    this.roundingSettings$ = this.store.pipe(select(fromSharedStructuresReducer.getRoundingSettings));
    this.rangeOverrides$ = this.store.pipe(select(fromSharedStructuresReducer.getRangeOverrides));
    this.distinctOverrideMessages$ = this.store.pipe(select(fromSharedStructuresReducer.getDistinctOverrideMessages));
    this.selectedPeerExchange$ = this.store.pipe(select(fromSharedStructuresReducer.getSelectedPeerExchange));
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
      ExportSourceName: 'Job Range Structures',
      CustomExportType: 'JobRangeStructures',
      ColumnChooserType: ColumnChooserType.Hybrid,
      EnableGroupSelectAll: true
    };

    this.invalidMidPointRanges = [];
    this.modifiedKeys = [];
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.defaultPagingOptions = {
      From: 0,
      Count: 50
    };
    this.defaultSort = [{
      dir: 'asc',
      field: 'CompanyStructures_Ranges_Mid'
    }];
    this.currentRangeGroup$ = this.store.pipe(select(fromSharedStructuresReducer.getCurrentRangeGroup));
  }

  hideRowActions(): boolean {
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
    if (metaInfo.pageViewId === JobBasedPageViewIds.EmployeesMinMidMax
      || metaInfo.pageViewId === JobBasedPageViewIds.EmployeesTertile
      || metaInfo.pageViewId === JobBasedPageViewIds.EmployeesQuartile
      || metaInfo.pageViewId === JobBasedPageViewIds.EmployeesQuintile
      || metaInfo.pageViewId === JobBasedPageViewIds.Pricings) {
      store.dispatch(new fromPfDataGridActions.LoadData(metaInfo.pageViewId));
    }
  }

  // Events
  handleAddJobsClicked() {
    this.addJobs.emit();
  }

  handlePublishModelClicked() {
    this.store.dispatch(new fromPublishModelModalActions.OpenModal());
  }

  handleModelSettingsClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  openRemoveRangeModal(rangeId: number) {
    this.rangeIdToRemove = rangeId;
    this.showRemoveRangeModal.next(true);
    this.store.dispatch(new fromSharedJobBasedRangeActions.ShowRemoveRangeModal());
  }

  revertChanges(dataRow: any, rowIndex: number) {
    this.store.dispatch(new fromSharedStructuresActions.RevertingRangeChanges({
      pageViewId: this.modelPageViewId,
      rangeId: dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID,
      rangeGroupId: dataRow.CompanyStructures_RangeGroup_CompanyStructuresRangeGroup_ID,
      rowIndex: rowIndex,
      refreshRowDataViewFilter: this.getRefreshFilter(dataRow)
    }));
  }

  removeRange() {
    this.store.dispatch(new fromSharedJobBasedRangeActions.RemovingRange({ StructuresRangeId: this.rangeIdToRemove, IsCurrent: this.metaData.IsCurrent }));
  }

  handleDuplicateModelClicked() {
    this.store.dispatch(new fromDuplicateModelModalActions.OpenModal());
  }

  scroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  handleSelectedRowAction(dropdown: any) {
    this.selectedDropdown = dropdown;
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

  handleOverrideMessageFilterChanged(value: any) {
    const field: ViewField = cloneDeep(this.overrideField);
    field.FilterValues = [value];
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (!!field.FilterValues) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  isManualOverride(dto: CompanyStructureRangeOverride): boolean {
    return dto.Max || dto.Min || dto.Mid || dto.FirstTertile || dto.SecondTertile || dto.FirstQuartile || dto.SecondQuartile || dto.FirstQuintile
      || dto.SecondQuintile || dto.ThirdQuintile || dto.FourthQuintile;
  }

  handleCompareModelClicked() {
    this.compareFlag = true;
    this.store.dispatch(new fromSharedStructuresActions.ComparingModels());
    this.store.dispatch(new fromPfDataGridActions.UpdatePagingOptions(this.pageViewId, this.defaultPagingOptions));
    this.compareModelClicked.emit();
  }

  public get rangeRecalculationType(): typeof RangeRecalculationType {
    return RangeRecalculationType;
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

  buildForm() {
    this.isNewModel = this.urlService.isInWorkflow(Workflow.NewRange);

    this.modelSettingsForm = new FormGroup({
      'StructureName': new FormControl(this.metaData.StructureName, [Validators.required, Validators.maxLength(50)]),
      'ModelName': new FormControl(!this.metaData.IsCurrent || this.isNewModel ? this.metaData.ModelName : '', [Validators.required, Validators.maxLength(50)]),
      'PayMarket': new FormControl(this.metaData.Paymarket, [Validators.required]),
      'Rate': new FormControl(this.metaData.Rate || 'Annual', [Validators.required]),
      'Currency': new FormControl(this.metaData.Currency || 'USD', [Validators.required]),
      'PeerExchange': new FormControl(this.selectedExchange?.ExchangeName || 'Global Network', [Validators.required]),
      'RangeDistributionSetting': new FormControl(this.metaData.RangeDistributionSetting),
      'RangeAdvancedSetting': new FormControl(this.metaData.RangeAdvancedSetting)
    });

    this.store.dispatch(new fromModelSettingsModalActions.SetActiveTab('modelTab'));
  }

  getFilterQueryParam(fieldName: string, dataRow: any) {
    if (fieldName === 'CompanyStructures_RangeGroup_CountEEMinOutlier') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        value: dataRow.CompanyStructures_Ranges_Min
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEEMaxOutlier') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        value: dataRow.CompanyStructures_Ranges_Max
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEEQ1') {
      const value = this.metaData.RangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        ? (dataRow.CompanyStructures_Ranges_Min + dataRow.CompanyStructures_Ranges_Mid) / 2
        : dataRow.CompanyStructures_Ranges_Quartile_First;

      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Min,
        maxValue: value
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEEQ2') {
      const value = this.metaData.RangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        ? (dataRow.CompanyStructures_Ranges_Min + dataRow.CompanyStructures_Ranges_Mid) / 2
        : dataRow.CompanyStructures_Ranges_Quartile_First;

      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: value,
        maxValue: dataRow.CompanyStructures_Ranges_Mid
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEEQ3') {
      const value = this.metaData.RangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        ? (dataRow.CompanyStructures_Ranges_Mid + dataRow.CompanyStructures_Ranges_Max) / 2
        : dataRow.CompanyStructures_Ranges_Quartile_Second;

      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Mid,
        maxValue: value
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEEQ4') {
      const value = this.metaData.RangeDistributionTypeId === RangeDistributionTypeIds.MinMidMax
        ? (dataRow.CompanyStructures_Ranges_Mid + dataRow.CompanyStructures_Ranges_Max) / 2
        : dataRow.CompanyStructures_Ranges_Quartile_Second;

      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: value,
        maxValue: dataRow.CompanyStructures_Ranges_Max
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE1st5th') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Min,
        maxValue: dataRow.CompanyStructures_Ranges_Quintile_First
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE2nd5th') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Quintile_First,
        maxValue: dataRow.CompanyStructures_Ranges_Quintile_Second
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE3rd5th') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Quintile_Second,
        maxValue: dataRow.CompanyStructures_Ranges_Quintile_Third
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE4th5th') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Quintile_Third,
        maxValue: dataRow.CompanyStructures_Ranges_Quintile_Fourth
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEELast5th') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Quintile_Fourth,
        maxValue: dataRow.CompanyStructures_Ranges_Max
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE1st3rd') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Min,
        maxValue: dataRow.CompanyStructures_Ranges_Tertile_First
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEE2nd3rd') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Tertile_First,
        maxValue: dataRow.CompanyStructures_Ranges_Tertile_Second
      };
    }

    if (fieldName === 'CompanyStructures_RangeGroup_CountEELast3rd') {
      return {
        filterQuery: this.eeCountQueryFilters[fieldName],
        minValue: dataRow.CompanyStructures_Ranges_Tertile_Second,
        maxValue: dataRow.CompanyStructures_Ranges_Max
      };
    }
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = {
      'Mid': { Template: this.midColumn },
      'NumEmployees': { Template: this.eeCountColumn },
      'Job_Title': { Template: this.noFormattingInfoCircleColumn },
      'MarketReferencePointValue': { Template: this.mrpValueColumn },
      [PfDataGridColType.eeCountWithFilter]: { Template: this.eeCountWithFilterColumn },
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn },
      [PfDataGridColType.rangeFieldEditor]: { Template: this.rangeFieldColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn }
    };

    this.filterTemplates = {
      'OverrideMessage': { Template: this.overrideFilter }
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
    this.compareFlag = false;
    this.modelPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelPageViewId = pv);
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
    this.metaDataSub = this.metaData$.subscribe(md => this.metaData = md);
    this.distinctOverrideMessagesSub =
      this.distinctOverrideMessages$.subscribe(dom => this.distinctOverrideMessages = dom.filter(function (el) {
        return el != null;
      }));
    this.rangeOverridesSub = this.rangeOverrides$.subscribe(ro => this.rangeOverrides = ro);
    this.removingRange$ = this.store.select(fromSharedJobBasedRangeReducer.getRemovingRange);
    this.selectedRecordId$ = this.store.select(fromPfDataGridReducer.getSelectedRecordId, this.modelPageViewId);
    this.removingRangeSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromSharedJobBasedRangeActions.REMOVING_RANGE_SUCCESS))
      .subscribe(data => {
        this.showRemoveRangeModal.next(false);
      });
    this.initPermissions();
    this.modifiedKeysSubscription = this.store.select(fromReducer.getModifiedKeys, this.modelPageViewId).subscribe(
      modifiedKeys => this.modifiedKeys = modifiedKeys
    );
    this.currentRangeGroupSub = this.currentRangeGroup$.subscribe(rangeGroup => {
      if (rangeGroup.obj) {
        this.currentRangeGroup = rangeGroup.obj;
        this.currentRangeGroupId = this.currentRangeGroup.CompanyStructuresRangeGroupId;
        this.currentRangeGroupName = this.currentRangeGroup.RangeGroupName;
      }
    });
    this.gridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.modelPageViewId).subscribe(fields => {
      if (fields) {
        this.overrideField = fields.find(f => f.SourceName === 'OverrideMessage');
        if (!!this.overrideField?.FilterValues) {
          this.selectedOverrideMessage = this.overrideField.FilterValues[0];
        }
      }
    });

    this.selectedPeerExchangeSub = this.selectedPeerExchange$.subscribe(peerExchange => this.selectedExchange = peerExchange);

    this.modalOpenSub = this.modalOpen$.subscribe(mo => {
      if (mo) {
        this.buildForm();
      }
    });

    this.buildForm();

    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy(): void {
    this.modelPageViewIdSubscription.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.metaDataSub.unsubscribe();
    this.roundingSettingsSub.unsubscribe();
    this.rangeOverridesSub.unsubscribe();
    this.modifiedKeysSubscription.unsubscribe();
    this.currentRangeGroupSub.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.distinctOverrideMessagesSub.unsubscribe();
    this.modalOpenSub.unsubscribe();
    this.selectedPeerExchangeSub.unsubscribe();
  }
}
