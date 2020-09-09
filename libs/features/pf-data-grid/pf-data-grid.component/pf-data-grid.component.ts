import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ViewField, SimpleDataView, PagingOptions, DataViewType } from 'libs/models/payfactors-api';
import { AppNotification, NotificationLevel } from 'libs/features/app-notifications/models';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import * as fromReducer from '../reducers';
import * as fromActions from '../actions';
import {
  PfDataGridFilter,
  ActionBarConfig,
  getDefaultActionBarConfig,
  GridRowActionsConfig,
  GridConfig
} from '../models';
import { getUserFilteredFields } from '../components';
import { SelectAllStatus } from '../reducers/pf-data-grid.reducer';

@Component({
  selector: 'pf-data-grid',
  templateUrl: './pf-data-grid.component.html',
  styleUrls: ['./pf-data-grid.component.scss'],
})
export class PfDataGridComponent implements OnChanges, OnInit, OnDestroy {

  @Input() pageViewId: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() titleActionsTemplate: TemplateRef<any>;
  @Input() navigationURL: string;
  @Input() showTitle = true;
  @Input() selectionField: string;
  @Input() columnTemplates: any;
  @Input() aboveGridTemplate: TemplateRef<any>;
  @Input() rightGridTemplate: TemplateRef<any>;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() expandedRowTemplate: TemplateRef<any>;
  @Input() gridActionsTemplate: TemplateRef<any>;
  @Input() gridActionsRightTemplate: TemplateRef<any>;
  @Input() gridRowActionsConfig: GridRowActionsConfig;
  @Input() customHeaderTemplate: TemplateRef<any>;
  @Input() filterPanelTemplates: TemplateRef<any>;
  @Input() noRecordsFoundTemplate: TemplateRef<any>;
  // TODO: lockedPillText needs to be a collection of objects
  @Input() lockedPillText: string;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() enableSelection = false;
  @Input() defaultSort: SortDescriptor[];
  @Input() pagingOptions: PagingOptions;
  @Input() noRecordsFound: string;
  @Input() fieldsExcludedFromExport: [];
  @Input() compactGrid = false;
  @Input() backgroundColor: string;
  @Input() applyDefaultFilters: boolean;
  @Input() applyUserDefaultCompensationFields: boolean;
  @Input() allowSort = true;
  @Input() saveSort = false;
  @Input() preserveSelectionsOnGetConfig = false;
  @Input() actionBarClassName: string;
  @Input() headerClassName: string;
  @Input() gridContainerSplitViewWidth = '500px';
  @Input() splitOnSelection = true;
  @Input() splitViewDisplayFields = [];
  @Input() contentClassNamesOverrides: string;
  @Input() exportSourceName: string;
  @Input() defaultColumnWidth = 200;
  @Input() showHeaderWhenCompact: boolean;
  @Input() useColumnGroups = true;
  @Input() actionBarConfig: ActionBarConfig = getDefaultActionBarConfig();
  @Input() reorderable: boolean;
  @Input() borders = true;
  @Input() pageable = true;
  @Input() autoFitColumnsToHeader = false;
  @Input() pageTheme: 'default' | 'next-gen' = 'default';
  @Input() customSortOptions: (sortDescriptor: SortDescriptor[]) => SortDescriptor[] = null;
  @Input() syncScrollWithSplit = false;
  @Input() gridConfig: GridConfig;
  @Input() modifiedKey: string = null;
  @Input() resetWidthForSplitView = false;
  @Input() allowMultipleSort = false;
  @Input() showSplitViewToggle = false;
  @Input() showSortControls = true;
  @ViewChild('splitViewContainer', { static: false }) splitViewContainer: ElementRef;

  splitViewEmitter = new EventEmitter<string>();
  splitViewFilters$: Observable<PfDataGridFilter[]>;
  filterableFields$: Observable<ViewField[]>;
  globalFilterableFields: ViewField[];
  displayFilterPanel$: Observable<boolean>;
  savedViews$: Observable<SimpleDataView[]>;
  saveViewModalOpen$: Observable<boolean>;
  viewIsSaving$: Observable<boolean>;
  getNotification$: Observable<AppNotification<any>[]>;
  getExportEventId$: Observable<number>;
  getExportViewId$: Observable<number>;
  selectAllState$: Observable<string>;
  totalCount$: Observable<number>;
  gridDataResult$: Observable<GridDataResult>;

  userFilteredFieldsSubscription: Subscription;
  selectedRecordIdSubscription: Subscription;
  globalFilterableFieldsSubscription: Subscription;
  getNotificationSubscription: Subscription;
  getExportEventIdSubscription: Subscription;
  getExportViewIdSubscription: Subscription;
  getGridScrolledSubscription: Subscription;

  userFilteredFields: ViewField[];
  selectedRecordId: number;
  exportEventId = null;
  normalSplitViewWidth: string;
  selectAllStatus = SelectAllStatus;

  constructor(
    private store: Store<fromReducer.State>,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {}

  ngOnInit(): void {
    this.splitViewEmitter.subscribe(res => {
      switch (res) {
        case 'close':
          this.store.dispatch(new fromActions.UpdateSelectedRecordId(this.pageViewId, null, null));
          break;
        default:
          break;
      }
    });

    this.userFilteredFieldsSubscription = this.store.select(fromReducer.getFilterableFields, this.pageViewId).subscribe(fields => {
      this.userFilteredFields = getUserFilteredFields(fields);
    });

    this.selectedRecordIdSubscription = this.store.select(fromReducer.getSelectedRecordId, this.pageViewId).subscribe(recordId => {
      this.selectedRecordId = recordId;
    });

    this.globalFilterableFieldsSubscription = this.store.select(fromReducer.getGlobalFilters, this.pageViewId).subscribe(gl => {
      this.globalFilterableFields = gl;
    });

    this.splitViewFilters$ = this.store.select(fromReducer.getSplitViewFilters, this.pageViewId);
    this.filterableFields$ = this.store.select(fromReducer.getFilterableFields, this.pageViewId);
    this.displayFilterPanel$ = this.store.select(fromReducer.getFilterPanelDisplay, this.pageViewId);
    this.savedViews$ = this.store.select(fromReducer.getSavedViews, this.pageViewId);
    this.saveViewModalOpen$ = this.store.select(fromReducer.getSaveViewModalOpen, this.pageViewId);
    this.viewIsSaving$ = this.store.select(fromReducer.getViewIsSaving, this.pageViewId);
    this.getExportEventId$ = this.store.select(fromReducer.getExportEventId, this.pageViewId);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
    this.getExportViewId$ = this.store.select(fromReducer.getExportViewId, this.pageViewId);
    this.selectAllState$ = this.store.select(fromReducer.getSelectAllState, this.pageViewId);
    this.totalCount$ = this.store.select(fromReducer.getTotalCount, this.pageViewId);
    this.gridDataResult$ = this.store.select(fromReducer.getData, this.pageViewId);

    this.getExportEventIdSubscription = this.getExportEventId$.subscribe(eventId => {
      if (eventId !== this.exportEventId) {
        this.exportEventId = eventId;
      }
    });
    this.getNotificationSubscription = this.getNotification$.subscribe(notification => {
      const completeNotification = notification.find((x) =>
        (x.Level === NotificationLevel.Success || x.Level === NotificationLevel.Error) && x.NotificationId === this.exportEventId);
      if (completeNotification) {
        this.store.dispatch(new fromActions.ExportingComplete(this.pageViewId));
      }
    });
    this.getExportViewIdSubscription = this.getExportViewId$.subscribe(exportViewId => {
      if (!!exportViewId) {
        this.store.dispatch(new fromActions.GetExportingStatus(this.pageViewId, exportViewId));
      }
    });

    this.getGridScrolledSubscription = this.store.select(fromReducer.getGridScrolledContent, this.pageViewId).subscribe( scrolledContent => {
      if (scrolledContent && this.syncScrollWithSplit) {
        this.splitViewContainer.nativeElement.scrollTop = scrolledContent.scrollTop;
      }
    });

    this.normalSplitViewWidth = this.gridContainerSplitViewWidth;
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
    this.userFilteredFieldsSubscription.unsubscribe();
    this.selectedRecordIdSubscription.unsubscribe();
    this.globalFilterableFieldsSubscription.unsubscribe();
    this.getExportEventIdSubscription.unsubscribe();
    this.getNotificationSubscription.unsubscribe();
    this.getExportViewIdSubscription.unsubscribe();
    this.getGridScrolledSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['applyUserDefaultCompensationFields']) {
      this.store.dispatch(new fromActions.UpdateApplyUserDefaultCompensationFields(this.pageViewId,
        changes['applyUserDefaultCompensationFields'].currentValue));
    }

    if (changes['pageViewId']) {
      this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
      if (this.actionBarConfig.AllowSaveFilter) {
        this.store.dispatch(new fromActions.LoadSavedViews(changes['pageViewId'].currentValue));
      }
    }

    if (changes['selectionField']) {
      this.store.dispatch(new fromActions.UpdateSelectionField(this.pageViewId, changes['selectionField'].currentValue));
    }

    if (changes['inboundFilters']) {
      this.store.dispatch(new fromActions.UpdateInboundFilters(this.pageViewId, changes['inboundFilters'].currentValue));
    }

    if (changes['defaultSort']) {
      this.store.dispatch(new fromActions.UpdateDefaultSortDescriptor(this.pageViewId, changes['defaultSort'].currentValue));
    }

    if (changes['pagingOptions']) {
      this.store.dispatch(new fromActions.UpdatePagingOptions(this.pageViewId, changes['pagingOptions'].currentValue));
    }

    if (changes['applyDefaultFilters']) {
      this.store.dispatch(new fromActions.UpdateApplyDefaultFilters(this.pageViewId, changes['applyDefaultFilters'].currentValue));
    }

    if (changes['saveSort']) {
      this.store.dispatch(new fromActions.UpdateSaveSort(this.pageViewId, changes['saveSort'].currentValue));
    }
    if (changes['preserveSelectionsOnGetConfig']) {
      this.store.dispatch(new fromActions.UpdatePreserveSelectionsOnGetConfig(this.pageViewId, changes['preserveSelectionsOnGetConfig'].currentValue));
    }
    if (changes['fieldsExcludedFromExport']) {
      this.store.dispatch(new fromActions.UpdateFieldsExcludedFromExport(this.pageViewId, changes['fieldsExcludedFromExport'].currentValue));
    }
    if (changes['gridConfig']) {
      this.store.dispatch(new fromActions.UpdateGridConfig(this.pageViewId, changes['gridConfig'].currentValue));
    }
  }

  hasFilters(fields: ViewField[]): boolean {
    return fields.filter(f => f.FilterValue).length > 0;
  }

  toggleFilterPanel() {
    this.store.dispatch(new fromActions.ToggleFilterPanel(this.pageViewId));
  }

  closeFilterPanel() {
    this.store.dispatch(new fromActions.SetFilterPanelDisplay(this.pageViewId, false));
  }

  handleFilterChanged(field: ViewField) {
    this.store.dispatch(new fromActions.UpdateFilter(this.pageViewId, field));
  }

  clearFilter(field: ViewField, resetOperator = false) {
    this.store.dispatch(new fromActions.ClearFilter(this.pageViewId, field, resetOperator));
  }

  clearAllFilters() {
    this.store.dispatch(new fromActions.ClearAllNonGlobalFilters(this.pageViewId));
  }

  saveFilterClicked() {
    this.store.dispatch(new fromActions.OpenSaveViewModal(this.pageViewId));
  }

  closeSaveViewModal() {
    this.store.dispatch(new fromActions.CloseSaveViewModal(this.pageViewId));
  }

  saveFilterHandler(filterName) {
    this.store.dispatch(new fromActions.SaveView(this.pageViewId, filterName, DataViewType.savedFilter));
  }

  isSplitView() {
    return this.splitViewTemplate && (this.selectedRecordId || !this.splitOnSelection);
  }

  toggleSplitView() {
    this.gridContainerSplitViewWidth = this.gridContainerSplitViewWidth === this.normalSplitViewWidth ? '100%' : this.normalSplitViewWidth;
  }

}
