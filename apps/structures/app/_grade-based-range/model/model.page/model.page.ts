import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import { PfThemeType } from 'libs/features/pf-data-grid/enums/pf-theme-type.enum';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';

import { PagesHelper } from '../../../shared/helpers/pages.helper';
import * as fromSharedJobBasedRangeReducer from '../../../_job-based-range/shared/reducers';
import * as fromJobBasedRangeReducer from '../../../_job-based-range/shared/reducers';


@Component({
  selector: 'pf-model.page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  metadataSub: Subscription;

  rangeGroupId: any;
  modelSummaryPageViewId: string;
  filter: PfDataGridFilter;
  isCollapsed: boolean;
  singleRecordActionBarConfig: ActionBarConfig;
  pfThemeType = PfThemeType;
  gridConfig: GridConfig;
  metadata: RangeGroupMetadata;
  colTemplates = {};

  constructor(public store: Store<fromJobBasedRangeReducer.State>,
              private route: ActivatedRoute) {
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filter = {
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };
    this.singleRecordActionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowActionBar: false
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
  }

  // Lifecycle
  ngAfterViewInit() {
    this.colTemplates = {
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn }
    };
  }

  ngOnInit(): void {
    this.modelSummaryPageViewId =
      PagesHelper.getModelSummaryPageViewIdByRangeDistributionType(this.metadata?.RangeDistributionTypeId);
  }

  ngOnDestroy(): void {
    this.metadataSub.unsubscribe();
  }
}
