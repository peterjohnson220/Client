import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

import { PageViewIds } from '../../constants/page-view-ids';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';
import { Pages } from '../../constants/pages';
import { RangeGroupMetadata } from "../../models";

@Component({
  selector: 'pf-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss']
})
export class ModelGridComponent implements AfterViewInit {
  @ViewChild('min', {static: false}) minColumn: ElementRef;
  @ViewChild('mid', {static: false}) midColumn: ElementRef;
  @ViewChild('max', {static: false}) maxColumn: ElementRef;
  @ViewChild('eeCount', {static: false}) eeCountColumn: ElementRef;
  @ViewChild('avgBaseSalary', {static: false}) avgBaseSalaryColumn: ElementRef;
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
  colTemplates = {};
  modelPageViewId = PageViewIds.Model;
  defaultPagingOptions: PagingOptions = {
    From: 0,
    Count: 10
  };
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyStructures_Ranges_Mid'
  }];
  singleRecordActionBarConfig: ActionBarConfig;
  fullGridActionBarConfig: ActionBarConfig;

  constructor(
    public store: Store<fromJobBasedRangeReducer.State>
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));

    this.singleRecordActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
    this.fullGridActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: true,
      ShowColumnChooser: true
    };
  }

  // Events
  handleAddJobsClicked() {
    this.addJobs.emit();
  }

  handlePublishModelClicked() {
    this.publishModel.emit();
  }

  handleModelSettingsClicked() {
    this.store.dispatch(new fromModelSettingsModalActions.OpenModal());
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = {
      ['Min']: {Template: this.minColumn},
      ['Mid']: {Template: this.midColumn},
      ['Max']: {Template: this.maxColumn},
      ['NumEmployees']: {Template: this.eeCountColumn},
      ['AvgBaseSalary']: {Template: this.avgBaseSalaryColumn},
      ['MarketReferencePointValue']: {Template: this.mrpValueColumn},
      ['AverageComparatio']: {Template: this.percentageColumn},
      ['AveragePositionInRange']: {Template: this.percentageColumn}
    };

    this.fullGridActionBarConfig = {
      ...this.fullGridActionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }
}
