import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ofType } from '@ngrx/effects';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

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
import { CompanyStructureRangeOverride, RoundingSettingsDataObj, RangeGroupMetadata, JobBasedPageViewIds } from 'libs/models/structures';
import { DataViewFilter, ViewField } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { RangeGroupType } from 'libs/constants/structures/range-group-type';
import { PermissionCheckEnum, Permissions } from 'libs/constants';
import { AsyncStateObj } from 'libs/models/state';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromReducer from 'libs/features/grids/pf-data-grid/reducers';
import { PermissionService } from 'libs/core/services';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';

import * as fromPublishModelModalActions from '../../actions/publish-model-modal.actions';
import * as fromDuplicateModelModalActions from '../../actions/duplicate-model-modal.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedJobBasedRangeActions from '../../../shared/actions/shared.actions';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { StructuresPagesService } from '../../services';


@Component({
  selector: 'pf-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss', '../../styles/pf-data-grid-styles.scss']
})
export class ModelGridComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mid') midColumn: ElementRef;
  @ViewChild('rangeField') rangeFieldColumn: ElementRef;
  @ViewChild('eeCount') eeCountColumn: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;
  @ViewChild('noFormattingInfoCircle', { static: true }) noFormattingInfoCircleColumn: ElementRef;
  @ViewChild('mrpValue') mrpValueColumn: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('overrideFilter') overrideFilter: ElementRef;
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
  rangeGroupType = RangeGroupType.Job;
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

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>,
    private actionsSubject: ActionsSubject,
    private permissionService: PermissionService,
    private structuresPagesService: StructuresPagesService
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRoundingSettings));
    this.rangeOverrides$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRangeOverrides));
    this.distinctOverrideMessages$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getDistinctOverrideMessages));
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
    this.currentRangeGroup$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getCurrentRangeGroup));
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
    this.store.dispatch(new fromSharedJobBasedRangeActions.RevertingRangeChanges({
      pageViewId: this.modelPageViewId,
      rangeId: dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID,
      rangeGroupId: dataRow.CompanyStructures_RangeGroup_CompanyStructuresRangeGroup_ID,
      rowIndex: rowIndex,
      roundingSettings: this.roundingSettings,
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
    const field = cloneDeep(this.overrideField);
    field.FilterValue = value;
    field.FilterOperator = '=';
    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
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
    this.store.dispatch(new fromSharedJobBasedRangeActions.ComparingModels());
    this.store.dispatch(new fromPfDataGridActions.UpdatePagingOptions(this.pageViewId, this.defaultPagingOptions));
    this.compareModelClicked.emit();
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = {
      'Mid': { Template: this.midColumn },
      'NumEmployees': { Template: this.eeCountColumn },
      'Job_Title': { Template: this.noFormattingInfoCircleColumn },
      'MarketReferencePointValue': { Template: this.mrpValueColumn },
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
        if (this.overrideField != null) {
          this.selectedOverrideMessage = this.overrideField.FilterValue;
        }
      }
    });

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
  }
}
