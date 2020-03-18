import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SortDescriptor } from '@progress/kendo-data-query';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

import { PageViewIds } from '../../constants/page-view-ids';
import * as fromSharedJobBasedRangeReducer from '../../../shared/reducers';
import * as fromJobBasedRangeReducer from '../../reducers';
import { RangeGroupMetadata } from '../../models';

@Component({
  selector: 'pf-model-grid',
  templateUrl: './model-grid.component.html',
  styleUrls: ['./model-grid.component.scss']
})
export class ModelGridComponent implements AfterViewInit {
  @ViewChild('mid', {static: false}) midColumn: ElementRef;
  @ViewChild('eeCount', {static: false}) eeCountColumn: ElementRef;
  @ViewChild('mrpValue', {static: false}) mrpValueColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @Input() singleRecordView: boolean;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() inboundFilter: PfDataGridFilter;
  @Input() rangeGroupId: number;
  @Output() addJobs = new EventEmitter();

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

  handleAddJobsClicked() {
    this.addJobs.emit();
  }

  ngAfterViewInit() {
    this.colTemplates = {
      ['Mid']: {Template: this.midColumn},
      ['NumEmployees']: {Template: this.eeCountColumn},
      ['MarketReferencePointValue']: {Template: this.mrpValueColumn}
    };

    this.fullGridActionBarConfig = {
      ...this.fullGridActionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }
}
