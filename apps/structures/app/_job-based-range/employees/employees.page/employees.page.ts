import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { Permissions } from 'libs/constants';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import * as fromDuplicateModelModalActions from '../../shared/actions/duplicate-model-modal.actions';
import { PageViewIds } from '../../shared/constants/page-view-ids';
import { Pages } from '../../shared/constants/pages';
import { RangeGroupMetadata } from '../../shared/models';
import { StructuresPagesService } from '../../shared/services';
import * as fromSharedActions from '../../shared/actions/shared.actions';


@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;
  @ViewChild('date', { static: true }) dateColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  colTemplates = {};
  filter: PfDataGridFilter;
  employeePageViewId = PageViewIds.Employees;
  page = Pages.Employees;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;
  pageViewId: string;
  pageViewIdSubscription: Subscription;

  gridConfig: GridConfig;
  hasInfiniteScrollFeatureFlagEnabled: boolean;
  defaultPagingOptions: PagingOptions;

  constructor(
    public store: Store<fromSharedJobBasedRangeReducer.State>,
    public route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
    private featureFlagService: AbstractFeatureFlagService
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
    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.pageViewId = pv);
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled
    };
    this.defaultPagingOptions = {
      From: 0,
      Count: 50
    };
  }

  // Events
  handleModelSettingsBtnClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  handleDuplicateModelBtnClicked() {
    this.store.dispatch(new fromDuplicateModelModalActions.OpenModal());
  }

  // Lifecycle
  ngOnInit(): void {
    return;
  }



  ngAfterViewInit(): void {
    this.colTemplates = {
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn },
      [PfDataGridColType.date]: { Template: this.dateColumn },
      [PfDataGridColType.percentage]: { Template: this.percentageColumn }
    };

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };

    // Get all overridden ranges
    this.store.dispatch(new fromSharedActions.GetOverriddenRanges({
      pageViewId: this.pageViewId,
      rangeGroupId: this.rangeGroupId
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
    this.pageViewIdSubscription.unsubscribe();
  }
}

