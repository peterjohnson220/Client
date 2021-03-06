import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import {
  ActionBarConfig,
  getDefaultActionBarConfig,
  GridConfig,
  GridRowActionsConfig,
  getDefaultGridRowActionsConfig,
  PfDataGridCustomFilterDisplayOptions,
  PfDataGridCustomFilterOptions
} from 'libs/features/grids/pf-data-grid/models';
import { ViewField } from 'libs/models/payfactors-api/reports/request';

import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import {Permissions} from 'libs/constants';
import {PfSecuredResourceDirective} from 'libs/forms/directives';
import * as fromAutoShareModalActions from 'libs/features/users/user-settings/actions';
import { ShareModalOperation } from 'libs/models/share-modal/share-modal-operation';
import * as fromFeatureFlagRedirectReducer from 'libs/state/state';
import { UrlPage } from 'libs/models/url-redirect/url-page';
import { TooltipTypes } from 'libs/constants/projects/tooltip-constants';

import {PageViewIds} from '../../shared/constants';

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

  pinnedFilterOptions = [{
    Display: '',
    Value: null
  }, {
    Display: 'Yes',
    Value: 'true'
  }, {
    Display: 'No',
    Value: 'false'
  }];

  statusFilterDisplayOptions: PfDataGridCustomFilterDisplayOptions[] = [{
    Display: '',
    Value: null
  }, {
    Display: 'Complete',
    Value: 'true'
  }, {
    Display: 'In Progress',
    Value: 'false'
  }];

  customStatusFilterOptions: PfDataGridCustomFilterOptions[] = [{
    EntitySourceName: 'UserSessions',
    SourceName: 'Completed',
    FilterDisplayOptions: this.statusFilterDisplayOptions
  }];

  status = this.statusFilterDisplayOptions[0];
  isPinned = this.pinnedFilterOptions[0];

  isCompletedField: ViewField;
  isPinnedField: ViewField;

  gridfieldSubscription: Subscription;
  selectedRecordIdsSubscription: Subscription;

  autoShareOperation: ShareModalOperation = ShareModalOperation.BulkProjectShare;

  showDeleteProjectModal = new BehaviorSubject<boolean>(false);
  showDeleteProjectModal$ = this.showDeleteProjectModal.asObservable();

  pricingProjectSlug$: Observable<string>;
  redirectSlugLoading$: Observable<boolean>;
  redirectSlugLoadingError$: Observable<boolean>;

  tooltipDataTypes = TooltipTypes;

  @ViewChild('projectStatusColumn') projectStatusColumn: ElementRef;
  @ViewChild('projectStatusFilter') projectStatusFilter: ElementRef;
  @ViewChild('projectPinnedFilter') projectPinnedFilter: ElementRef;
  @ViewChild('gridRowActionsTemplate') gridRowActionsTemplate: ElementRef;
  @ViewChild('numJobsColumn') numJobsColumn: ElementRef;
  @ViewChild('numSharedColumn') numSharedColumn: ElementRef;
  @ViewChild('projectName') projectName: ElementRef;
  @ViewChild(PfSecuredResourceDirective) pfSecuredResourceDirective: PfSecuredResourceDirective;
  @ViewChild('shareBtn') shareBtn: ElementRef;


  constructor( private store: Store<fromPfDataGridReducer.State>) {
    this.pricingProjectSlug$ = this.store.select(fromFeatureFlagRedirectReducer.getPageRedirectUrl, {page: UrlPage.PricingProject});
    this.redirectSlugLoading$ = this.store.select(fromFeatureFlagRedirectReducer.getLoading);
    this.redirectSlugLoadingError$ = this.store.select(fromFeatureFlagRedirectReducer.getLoadingError);

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

        this.status = this.isCompletedField?.FilterValues?.length > 0 ?
          this.statusFilterDisplayOptions.find(x => x.Value === this.isCompletedField.FilterValues[0]) : null;
        this.isPinned = this.isPinnedField?.FilterValues?.length > 0 ?
          this.pinnedFilterOptions.find(x => x.Value === this.isPinnedField.FilterValues[0]) : null;
      }
    });
    window.addEventListener('scroll', this.scroll, true);
  }

  scroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  ngAfterViewInit() {
    this.colTemplates = {
      'Completed': {Template: this.projectStatusColumn},
      'Session_Name': {Template: this.projectName},
      'Number_Of_Jobs': {Template: this.numJobsColumn},
      'Number_Of_Shares': {Template: this.numSharedColumn}
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

  handleStatusFilterChanged() {
    const field: ViewField = cloneDeep(this.isCompletedField);
    field.FilterValues = this.status.Value === null ? [] : [this.status.Value];
    field.FilterOperator = '=';

    this.updateField(field);
  }

  handlePinnedFilterChanged() {
    const field: ViewField = cloneDeep(this.isPinnedField);
    field.FilterValues = this.isPinned.Value === null ? [] : [this.isPinned.Value];
    field.FilterOperator = '=';

    this.updateField(field);
  }

  updateField(field: ViewField) {
    if (field?.FilterValues?.length > 0) {
      this.store.dispatch(new fromPfDataGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfDataGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  handleSelectedRowAction(projectId: number, dropdown: any) {
    if (this.selectedDropdown?.isOpen() && this.selectedDropdown !== dropdown) {
      this.selectedDropdown.close();
    }
    this.selectedDropdown = dropdown;
    this.selectedProjectId = projectId;
  }

  handleModalDismissed(): void {
    this.acknowledgeDelete = false;
    this.selectedProjectId = null;
    this.showDeleteProjectModal.next(false);
  }

  handleModalSubmit(): void {
    this.acknowledgeDelete = false;
    if (this.selectedProjectId) {
      this.store.dispatch(new fromProjectListPageActions.DeleteProjects([this.selectedProjectId]));
      if (this.selectedRecordIds.indexOf(this.selectedProjectId) > -1) {
        this.store.dispatch(new fromPfDataGridActions.UpdateSelectedKey(this.pageViewId, this.selectedProjectId));
      }
    } else if (this.selectedRecordIds) {
      this.store.dispatch(new fromProjectListPageActions.DeleteProjects(this.selectedRecordIds));
      this.store.dispatch(new fromPfDataGridActions.ClearSelections(this.pageViewId));
    }
    this.showDeleteProjectModal.next(false);
  }

  ngOnDestroy() {
    this.selectedRecordIdsSubscription.unsubscribe();
    this.gridfieldSubscription.unsubscribe();
  }

  openShareFromActions(projectId: number) {
    this.store.dispatch(new fromProjectListPageActions.SaveSingleProjectShareId(projectId));
    this.openShareModal();
  }

  openShareModal() {
    this.shareBtn.nativeElement.blur();
    this.store.dispatch(new fromAutoShareModalActions.OpenAutoShareModal());
  }
}
