import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { GradeBasedPageViewIds, RangeGroupMetadata } from 'libs/models/structures';
import { ActionBarConfig, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';

import { PagesHelper } from '../../../shared/helpers/pages.helper';
import * as fromSharedStructuresReducer from '../../../shared/reducers';
import { StructuresPagesService } from '../../../shared/services';

@Component({
  selector: 'pf-employees-page',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss']
})
export class EmployeesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rangeValue', { static: true }) rangeValueColumn: ElementRef;

  employeesPageViewId: string;
  dataCutsPageViewId: string;
  modelGridPageViewId: string;
  pageViewId: string;
  metaData$: Observable<RangeGroupMetadata>;
  metadataSubscription: Subscription;
  actionBarConfig: ActionBarConfig;
  singleRecordActionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  pfThemeType = PfThemeType;
  rangeGroupId: number;
  rangeId: number;
  colTemplates = {};

  activeTab: string;
  filter: PfDataGridFilter;

  modelGridPageViewIdSubscription: Subscription;

  filterTemplates = {};

  constructor(public store: Store<fromSharedStructuresReducer.State>,
              public route: ActivatedRoute,
              private structuresPagesService: StructuresPagesService) {
    this.metaData$ = this.store.pipe(select(fromSharedStructuresReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.employeesPageViewId = PagesHelper.getEmployeePageViewIdByRangeTypeAndRangeDistributionType(md.RangeTypeId, md.RangeDistributionTypeId);
        this.dataCutsPageViewId = GradeBasedPageViewIds.DataCuts;
        this.pageViewId = this.employeesPageViewId;
      }
    });

    this.modelGridPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelGridPageViewId = pv);

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
      ShowFilterChooser: true
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
  }

  onEmployeesClicked() {
    this.activeTab = 'Employees';
    this.pageViewId = this.employeesPageViewId;
    return false;
  }

  onDataCutsClicked() {
    // TODO this is Employees implementation - we need to change this in the future
    this.filter = {
      SourceName: 'CompanyStructuresRanges_ID',
      Operator: '=',
      Value: this.route.snapshot.params.id
    };

    this.activeTab = 'DataCuts';
    this.pageViewId = this.dataCutsPageViewId;
    return false;
  }

  // Lifecycle
  ngOnInit(): void {
    this.activeTab = 'Employees';
  }

  ngAfterViewInit(): void {
    this.colTemplates = {
      ['Mid']: { Template: this.rangeValueColumn },
      [PfDataGridColType.rangeFieldEditor]: { Template: this.rangeValueColumn }
    };
  }

  ngOnDestroy(): void {
    this.metadataSubscription.unsubscribe();
    this.modelGridPageViewIdSubscription.unsubscribe();
  }
}
