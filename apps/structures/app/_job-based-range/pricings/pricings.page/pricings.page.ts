import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RangeGroupMetadata } from 'libs/models/structures';
import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import { Permissions } from 'libs/constants';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';
import { PfThemeType } from 'libs/features/pf-data-grid/enums/pf-theme-type.enum';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
import { PageViewIds } from '../../shared/constants/page-view-ids';
import { StructuresPagesService } from '../../shared/services';
import * as fromSharedActions from '../../shared/actions/shared.actions';
import * as fromDuplicateModelModalActions from '../../shared/actions/duplicate-model-modal.actions';


@Component({
  selector: 'pf-pricings-page',
  templateUrl: './pricings.page.html',
  styleUrls: ['./pricings.page.scss']
})
export class PricingsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('source') sourceColumn: ElementRef;
  @ViewChild('jobTitleCode') jobTitleCode: ElementRef;
  @ViewChild('rangeValue') rangeValueColumn: ElementRef;
  @ViewChild('gridGlobalActions', { static: true }) gridGlobalActionsTemplate: ElementRef;
  @ViewChild('noFormatting', { static: true }) noFormattingColumn: ElementRef;

  metaData$: Observable<RangeGroupMetadata>;
  filter: PfDataGridFilter;
  colTemplates = {};
  pageViewId = PageViewIds.Pricings;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;
  modelPageViewId: string;
  modelPageViewIdSubscription: Subscription;
  pfThemeType = PfThemeType;

  gridConfig: GridConfig;
  hasInfiniteScrollFeatureFlagEnabled: boolean;

  constructor(
    private store: Store<fromSharedJobBasedRangeReducer.State>,
    private route: ActivatedRoute,
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
      ColumnChooserType: ColumnChooserType.Hybrid
    };

    this._Permissions = Permissions;
    this.modelPageViewIdSubscription = this.structuresPagesService.modelPageViewId.subscribe(pv => this.modelPageViewId = pv);
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.gridConfig = {
      PersistColumnWidth: false,
      CaptureGridScroll: true,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled
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
      'Source': { Template: this.sourceColumn },
      'Job_Title': { Template: this.jobTitleCode },
      [PfDataGridColType.rangeValue]: { Template: this.rangeValueColumn },
      [PfDataGridColType.noFormatting]: { Template: this.noFormattingColumn }
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
  }
}

