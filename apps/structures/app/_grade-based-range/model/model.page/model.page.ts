import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';

import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';


@Component({
  selector: 'pf-model.page',
  templateUrl: './model.page.html',
  styleUrls: ['./model.page.scss']
})
export class ModelPageComponent implements OnInit, OnDestroy {

  metaData$: Observable<RangeGroupMetadata>;

  pageViewIdSubscription: Subscription;
  pageSummaryViewIdSubscription: Subscription;
  rangeGroupId: any;
  modelSummaryPageViewId: string;
  modelGridPageViewId: string;
  filters: PfDataGridFilter[];
  pfThemeType = PfThemeType;
  metadata: RangeGroupMetadata;

  constructor(
    public store: Store<fromSharedStructuresReducer.State>,
    private route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService
  ) {
    this.rangeGroupId = this.route.snapshot.params.id;
    this.filters = [{
      SourceName: 'CompanyStructuresRangeGroup_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    }];
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.pageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);
    this.pageSummaryViewIdSubscription = this.structuresPagesService.modelSummaryViewId.subscribe(pv => this.modelSummaryPageViewId = pv);
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.pageViewIdSubscription.unsubscribe();
    this.pageSummaryViewIdSubscription.unsubscribe();
  }
}
