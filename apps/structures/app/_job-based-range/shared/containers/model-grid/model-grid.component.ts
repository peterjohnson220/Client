import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

import { PageViewIds } from '../../constants/page-view-ids';
import { RangeGroupMetadata, RoundingSettingsDataObj } from '../../models';
import { Pages } from '../../constants/pages';
import * as fromPublishModelModalActions from '../../actions/publish-model-modal.actions';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromSharedActions from '../../../shared/actions/shared.actions';
import * as fromModelSettingsModalActions from '../../../shared/actions/model-settings-modal.actions';
import * as fromJobBasedRangeReducer from '../../reducers';

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
  @ViewChild('avgBaseSalary', {static: false}) avgBaseSalaryColumn: ElementRef;
  @ViewChild('mrpValue', {static: false}) mrpValueColumn: ElementRef;
  @ViewChild('percentage', { static: true }) percentageColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @Input() singleRecordView: boolean;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() inboundFilters: PfDataGridFilter[];
  @Input() rangeGroupId: number;
  @Input() page: Pages;
  @Input() reorderable: boolean;
  @Output() addJobs = new EventEmitter();
  @Output() publishModel = new EventEmitter();
  @Output() openModelSettings = new EventEmitter();

  metaData$: Observable<RangeGroupMetadata>;
  roundingSettings$: Observable<RoundingSettingsDataObj>;
  roundingSettingsSub: Subscription;
  roundingSettings: RoundingSettingsDataObj;
  colTemplates = {};
  modelPageViewId = PageViewIds.Model;
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

  handleRangeOverrideOnBlur(dataRow: any, event: any, index: number) {
    // kendo should be ensuring that only numbers make it this far
    const targetValue = parseFloat(event.target.value);

    // we got this far, consider it valid. construct the payload and dispatch the action
    const payload = {
      RangeId: dataRow.CompanyStructures_Ranges_CompanyStructuresRanges_ID,
      RangeGroupId: dataRow.CompanyStructures_RangeGroup_CompanyStructuresRangeGroup_ID,
      RowIndex: index,
      Mid: targetValue,
      Page: this.page,
      RoundingSettings: this.roundingSettings
    };

    // TODO - we really should be just persisting rounding settings rather than passing every time, but that is coming later.
    this.store.dispatch(new fromSharedActions.UpdateMid(payload));
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

  ngOnInit(): void {
    this.roundingSettingsSub = this.roundingSettings$.subscribe(rs => this.roundingSettings = rs);
  }

  ngOnDestroy(): void {
    this.roundingSettingsSub.unsubscribe();
  }
}
