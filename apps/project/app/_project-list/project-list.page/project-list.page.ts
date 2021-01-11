import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';

import {
  ActionBarConfig,
  GridConfig,
  GridRowActionsConfig,
  getDefaultActionBarConfig,
  getDefaultGridRowActionsConfig
} from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import { PageViewIds } from '../constants';

import * as fromProjectListPageActions from '../actions';

@Component({
  selector: 'pf-project-list-page',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss']
})

export class ProjectListPageComponent implements AfterViewInit {
  colTemplates = {};
  selectedRecordIds$: Observable<any>;
  pageViewId = PageViewIds.Projects;
  gridConfig: GridConfig;
  actionBarConfig: ActionBarConfig;
  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'UserSessionMap_Last_Viewed'
  }];
  gridRowActionsConfig: GridRowActionsConfig = getDefaultGridRowActionsConfig();

  @ViewChild('projectStatusColumn') projectStatusColumn: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;

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
      ShowFilterChooser: false
    };
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Completed': {Template: this.projectStatusColumn}
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
}
