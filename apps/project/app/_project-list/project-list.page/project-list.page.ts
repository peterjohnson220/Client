import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import {Store} from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {SortDescriptor} from '@progress/kendo-data-query';
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

import {PageViewIds} from '../constants';

import * as fromProjectListPageActions from '../actions';

@Component({
  selector: 'pf-project-list-page',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss']
})

export class ProjectListPageComponent implements AfterViewInit, OnInit, OnDestroy {
  colTemplates = {};
  filterTemplates = {}; // filter panel requires this even if it is blank... otherwise it gets mad.
  selectedRecordIds$: Observable<any>;
  pageViewId = PageViewIds.Projects;
  gridConfig: GridConfig;
  actionBarConfig: ActionBarConfig;
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

  @ViewChild('projectStatusColumn') projectStatusColumn: ElementRef;
  @ViewChild('projectStatusFilter') projectStatusFilter: ElementRef;
  @ViewChild('projectPinnedFilter') projectPinnedFilter: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('numJobsColumn') numJobsColumn: ElementRef;

  constructor( private store: Store<fromPfDataGridReducer.State>) {
    this.selectedRecordIds$ = this.store.select(fromPfDataGridReducer.getSelectedKeys, this.pageViewId);
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

        this.isCompleted = this.isCompletedField.FilterValue === null ? ' ' : this.isCompleted;
        this.isPinned = this.isPinnedField.FilterValue === null ? ' ' : this.isPinned;
      }
    });
  }

  ngOnDestroy() {
    this.gridfieldSubscription.unsubscribe();
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

  copyProject(projectId: number) {
    this.store.dispatch(new fromProjectListPageActions.CopyProject(projectId));
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
}
