import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { Permissions } from 'libs/constants';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import * as fromDuplicateModelModalActions from '../../shared/actions/duplicate-model-modal.actions';
import * as fromSharedActions from '../../shared/actions/shared.actions';
import { PagesHelper } from '../../../shared/helpers/pages.helper';
import { StructuresPagesService } from '../../../shared/services';


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
  metadataSubscription: Subscription;
  colTemplates = {};
  filter: PfDataGridFilter;
  pageViewId: string;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;
  modelPageViewId: string;
  modelPageViewIdSubscription: Subscription;
  pfThemeType = PfThemeType;
  groupFieldSelected = false;
  selectedFieldsSubscription: Subscription;

  gridConfig: GridConfig;
  filterTemplates = {};

  constructor(
    public store: Store<fromSharedJobBasedRangeReducer.State>,
    public route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
  ) {
    this.metaData$ = this.store.pipe(select(fromSharedJobBasedRangeReducer.getMetadata));
    this.metadataSubscription = this.metaData$.subscribe(md => {
      if (md) {
        this.pageViewId = PagesHelper.getEmployeePageViewIdByRangeDistributionType(md.RangeDistributionTypeId);
      }
    });

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

    this._Permissions = Permissions;
    this.modelPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelPageViewId = pv);
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };

    this.selectedFieldsSubscription = this.store.select(fromPfGridReducer.getFields, this.modelPageViewId).subscribe(fields => {
      if (fields) {
        const anyGroupField = fields.find(f => f.Group && f.IsSelected);
        this.groupFieldSelected = !!anyGroupField;
      }
    });
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
      pageViewId: this.modelPageViewId,
      rangeGroupId: this.rangeGroupId
    }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new fromPfDataGridActions.Reset());
    this.modelPageViewIdSubscription.unsubscribe();
    this.metadataSubscription.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
  }
}
