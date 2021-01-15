import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {SortDescriptor} from '@progress/kendo-data-query';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import {
  ActionBarConfig,
  GridConfig,
  GridRowActionsConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig
} from 'libs/features/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import {Permissions} from 'libs/constants';
import {PfSecuredResourceDirective} from 'libs/forms/directives';

import {PageViewIds} from '../constants';

import * as fromProjectListPageActions from '../actions';

@Component({
  selector: 'pf-project-list-page',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss']
})

export class ProjectListPageComponent implements AfterViewInit, OnInit, OnDestroy {
  acknowledgeDelete = false;
  colTemplates = {};
  filterTemplates = {}; // filter panel requires this even if it is blank... otherwise it gets mad.
  selectedRecordIds$: Observable<any>;
  selectedRecordIds: any[];
  selectedDropdown: NgbDropdown;
  pageViewId = PageViewIds.Projects;
  gridConfig: GridConfig;
  actionBarConfig: ActionBarConfig;
  permissions = Permissions;
  selectedProjectId: number;
  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserSessionMap_Last_Viewed'
  }];
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();

  isCompleted = ' ';
  isPinned = ' ';
  customBooleanFilterOptions: string[] = [' ' , 'Yes', 'No'];

  isCompletedField: ViewField;
  isPinnedField: ViewField;

  gridfieldSubscription: Subscription;
  selectedRecordIdsSubscription: Subscription;

  @ViewChild('projectStatusColumn') projectStatusColumn: ElementRef;
  @ViewChild('projectStatusFilter') projectStatusFilter: ElementRef;
  @ViewChild('projectPinnedFilter') projectPinnedFilter: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('numJobsColumn') numJobsColumn: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;
  showDeleteProjectModal = new BehaviorSubject<boolean>(false);
  showDeleteProjectModal$ = this.showDeleteProjectModal.asObservable();

  constructor( private store: Store<fromPfDataGridReducer.State>) {
    this.selectedRecordIds$ = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId);
    this.selectedRecordIdsSubscription = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId).subscribe(sk => {
      this.selectedRecordIds = sk || [];
    });
    this.gridConfig = {
      PersistColumnWidth: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true,
      SelectAllPanelItemName: 'projects'
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true
    };
  }

  ngOnInit() {
    this.gridfieldSubscription = this.store.select(fromPfDataGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.isCompletedField = fields.find(f => f.SourceName === 'Completed');
        this.isPinnedField = fields.find(f => f.SourceName === 'PinOnDashboard');

        this.isCompleted = this.dbBitValueConverter(this.isCompletedField.FilterValue);
        this.isPinned = this.dbBitValueConverter(this.isPinnedField.FilterValue);
      }
    });
  }

  dbBitValueConverter(dbValue: string): string {
    if (dbValue === null) {
      return ' ';
    }

    return dbValue === 'true' ? 'Yes' : 'No';
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Completed': {Template: this.projectStatusColumn}
    };

    this.filterTemplates = {
      'Completed': {Template: this.projectStatusFilter, isFullSize: true},
      'PinOnDashboard': {Template: this.projectPinnedFilter, isFullSize: true}
    };

    this.gridRowActionsConfig = {
      ...this.gridRowActionsConfig,
      ActionsTemplate: this.gridRowActionsTemplate
    };
  }

  clearSelections() {
    this.store.dispatch(new fromPfDataGridActions.ClearSelections(this.pageViewId));
  }

  togglePinToDashboard(projectId: number) {
    this.store.dispatch(new fromProjectListPageActions.TogglePinOnDashboard(projectId));
  }

  copyProject() {
    this.store.dispatch(new fromProjectListPageActions.CopyProject(this.selectedProjectId));
  }

  handleCompletedFilterChanged(value: any) {
    this.isCompleted = value;

    const field: ViewField = cloneDeep(this.isCompletedField);
    field.FilterValue = this.filterValueConverter(value);
    field.FilterOperator = '=';

    this.updateField(field);
  }

  handlePinnedFilterChanged(value: any) {
    this.isPinned = value;

    const field: ViewField = cloneDeep(this.isPinnedField);
    field.FilterValue = this.filterValueConverter(value);
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

  filterValueConverter(value: string): string {
    if (value === ' ') {
      return null;
    }

    return value === 'Yes' ? 'true' : 'false';
  }

  handleSelectedRowAction(projectId: number, dropdown: any, isOpened: boolean) {
    if (this.selectedDropdown?.isOpen() && this.selectedDropdown !== dropdown) {
      this.selectedDropdown.close();
    }
    this.selectedDropdown = dropdown;
    this.selectedProjectId = projectId;
  }

  handleModalDismissed(): void {
    this.selectedProjectId = null;
    this.showDeleteProjectModal.next(false);
  }

  handleModalSubmit(): void {
    if (this.selectedProjectId) {
      this.store.dispatch(new fromProjectListPageActions.DeleteProjects([this.selectedProjectId]));
    } else if (this.selectedRecordIds$) {
      this.store.dispatch(new fromProjectListPageActions.DeleteProjects(this.selectedRecordIds));
    }
    this.showDeleteProjectModal.next(false);
  }

  ngOnDestroy() {
    this.selectedRecordIdsSubscription.unsubscribe();
    this.gridfieldSubscription.unsubscribe();
  }
}
