import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { Permissions } from 'libs/constants';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import { PageViewIds } from '../../shared/constants/page-view-ids';
import { Pages } from '../../shared/constants/pages';
import { RangeGroupMetadata } from '../../shared/models';
import { ColumnTemplateService } from '../../shared/services';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', {static: true}) noFormattingColumn: ElementRef;
  @ViewChild('date', {static: true}) dateColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  colTemplates = {};
  filter: PfDataGridFilter;
  employeePageViewId = PageViewIds.Employees;
  page = Pages.Employees;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;

  constructor(
     public store: Store<fromSharedJobBasedRangeReducer.State>,
     public route: ActivatedRoute
   ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.parent.snapshot.params.id;
    this.rangeId = parseInt(this.route.snapshot.params.id, 10);
    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: false
    };
    this._Permissions = Permissions;
  }

  // Events
  handleModelSettingsBtnClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }

  getColumnTemplates() {
    return {
      'rangeValue': this.rangeValueColumn,
      'percentage': this.percentageColumn,
      'noFormatting': this.noFormattingColumn,
      'date': this.dateColumn
    };
  }

  ngAfterViewInit(): void {
    this.colTemplates = ColumnTemplateService.configureEmployeeTemplates(this.getColumnTemplates());

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
  }
}

