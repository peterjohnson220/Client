import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';
import { RoundingSettingsDataObj } from 'libs/models/structures';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { RangeGroupType } from 'libs/constants/structures/range-group-type';

import { PageViewIds } from '../../constants/page-view-ids';
import { RangeGroupMetadata } from '../../models';
import { Pages } from '../../constants/pages';
import * as fromPublishModelModalActions from '../../actions/publish-model-modal.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { ColumnTemplateService } from '../../services';

@Component({
  selector: 'pf-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss', '../../styles/pf-data-grid-styles.scss']
})
export class ModelGridComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('min', {static: false}) minColumn: ElementRef;
  @ViewChild('mid', {static: false}) midColumn: ElementRef;
  @ViewChild('max', {static: false}) maxColumn: ElementRef;
  @ViewChild('eeCount', {static: false}) eeCountColumn: ElementRef;
  @ViewChild('rangeValue', {static: false}) rangeValueColumn: ElementRef;
  @ViewChild('mrpValue', {static: false}) mrpValueColumn: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @Input() singleRecordView: boolean;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() rangeGroupId: number;
  @Input() page: Pages;
  @Output() addJobs = new EventEmitter();
  @Output() publishModel = new EventEmitter();
  @Output() openModelSettings = new EventEmitter();

  metaData$: Observable<RangeGroupMetadata>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;
  roundingSettings: RoundingSettingsDataObj;
  colTemplates = {};
  modelPageViewId = PageViewIds.Model;
  rangeGroupType = RangeGroupType.Job;
  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 9999
  };
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyStructures_Ranges_Mid'
  }];
  singleRecordActionBarConfig: ActionBarConfig;
  fullGridActionBarConfig: ActionBarConfig;
  invalidMidPointRanges: number[];

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.roundingSettings$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getRoundingSettings));

    this.singleRecordActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
    this.fullGridActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      ShowColumnChooser: true
    };
    this.invalidMidPointRanges = [];
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
    let pageViewIdToRefresh = '';

    switch (metaInfo.page) {
      case Pages.Employees: {
        pageViewIdToRefresh = PageViewIds.Employees;
        break;
      }
      case Pages.Pricings: {
        pageViewIdToRefresh = PageViewIds.Pricings;
        break;
      }
    }

    if (pageViewIdToRefresh) {
      store.dispatch(new fromPfDataGridActions.LoadData(pageViewIdToRefresh));
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



  getColumnTemplates() {
    return {
      'min': this.minColumn,
      'mid': this.midColumn,
      'max': this.maxColumn,
      'eeCount': this.eeCountColumn,
      'rangeValue': this.rangeValueColumn,
      'mrpValue': this.mrpValueColumn,
      'percentage': this.percentageColumn
    };
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = ColumnTemplateService.configureJobRangeTemplates(this.getColumnTemplates());

    this.fullGridActionBarConfig = {
      ...this.fullGridActionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  ngOnInit(): void {
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  ngOnDestroy(): void {
    this.roundingSettingsSub.unsubscribe();
  }
}
