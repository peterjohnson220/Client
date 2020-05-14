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
  selector: 'pf-pricings-page',
  templateUrl: './pricings.page.html',
  styleUrls: ['./pricings.page.scss']
})
export class PricingsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('source', {static: false}) sourceColumn: ElementRef;
  @ViewChild('jobTitleCode', {static: false}) jobTitleCode: ElementRef;
  @ViewChild('rangeValue', {static: false}) rangeValueColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('noFormatting', {static: true}) noFormattingColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  filter: PfDataGridFilter;
  colTemplates = {};
  pricingsPageViewId = PageViewIds.Pricings;
  page = Pages.Pricings;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;

  constructor(
     private store: Store<fromSharedJobBasedRangeReducer.State>,
     private route: ActivatedRoute
   ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.rangeGroupId = this.route.parent.snapshot.params.id;
    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true
    };
    this.rangeId = parseInt(this.route.snapshot.params.id, 10);
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
      'source': this.sourceColumn,
      'jobTitleCode': this.jobTitleCode,
      'rangeValue': this.rangeValueColumn,
      'noFormatting': this.noFormattingColumn
    };
  }

  ngAfterViewInit(): void {
    this.colTemplates = ColumnTemplateService.configurePricingsTemplates(this.getColumnTemplates());

    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
  }
}

