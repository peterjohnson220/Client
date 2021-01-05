import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { JobBasedPageViewIds, RangeGroupMetadata } from 'libs/models/structures';
import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig, GridConfig, PfDataGridFilter } from 'libs/features/grids/pf-data-grid/models';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import { Permissions } from 'libs/constants';
import { PfDataGridColType } from 'libs/features/grids/pf-data-grid/enums';
import { PfThemeType } from 'libs/features/grids/pf-data-grid/enums/pf-theme-type.enum';
import { MODIFY_PRICINGS } from 'libs/features/pricings/multi-match/constants';
import * as fromRootState from 'libs/state/state';
import * as fromPfGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import { GetPricingsToModifyRequest } from 'libs/features/pricings/multi-match/models';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import { SurveySearchFilterMappingDataObj, SurveySearchUserFilterType } from 'libs/features/surveys/survey-search/data';
import { SearchFeatureIds } from 'libs/features/search/search/enums/search-feature-ids';
import * as fromModifyPricingsActions from 'libs/features/pricings/multi-match/actions';

import * as fromSharedJobBasedRangeReducer from '../../shared/reducers';
import * as fromModelSettingsModalActions from '../../shared/actions/model-settings-modal.actions';
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
  pageViewId = JobBasedPageViewIds.Pricings;
  rangeGroupId: any;
  rangeId: number;
  actionBarConfig: ActionBarConfig;
  _Permissions = null;
  modelPageViewId: string;
  restrictSurveySearchToPaymarketCountry: boolean;
  modelPageViewIdSubscription: Subscription;
  companySettingsSubscription: Subscription;
  metadataSub: Subscription;
  pfThemeType = PfThemeType;
  jobRangeGroupData: any;
  jobDataSubscription: Subscription;
  metadata: RangeGroupMetadata;
  groupFieldSelected = false;
  selectedFieldsSubscription: Subscription;

  gridConfig: GridConfig;
  multiMatchImplementation = MODIFY_PRICINGS;

  constructor(
    private store: Store<fromSharedJobBasedRangeReducer.State>,
    private route: ActivatedRoute,
    private structuresPagesService: StructuresPagesService,
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
    this.jobDataSubscription = this.store.select(fromPfGridReducer.getData, this.modelPageViewId).subscribe(data => {
      if (data?.data && data.data[0]) {
        this.jobRangeGroupData = data.data[0];
      }
    });
    this.companySettingsSubscription = this.store.select(fromRootState.getCompanySettings).subscribe(cs => {
      if (cs) {
        this.restrictSurveySearchToPaymarketCountry = cs.find(x => x.Key
          === 'RestrictSurveySearchCountryFilterToPayMarket').Value === 'true';
      }
    });
    this.metadataSub = this.metaData$.subscribe(md => this.metadata = md);
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
    this.companySettingsSubscription.unsubscribe();
    this.jobDataSubscription.unsubscribe();
    this.metadataSub.unsubscribe();
    this.selectedFieldsSubscription.unsubscribe();
  }

  modifyPricings() {
    const pricingPayload = {
      PricingId: this.jobRangeGroupData.CompanyJobs_Pricings_CompanyJobPricing_ID,
      JobId: this.jobRangeGroupData.CompanyJobs_CompanyJob_ID,
      PaymarketId: this.metadata.PaymarketId
    };

    const payload: GetPricingsToModifyRequest = {
      Pricings: [pricingPayload],
      RestrictSearchToPayMarketCountry: this.restrictSurveySearchToPaymarketCountry
    };

    this.store.dispatch(new fromSearchPageActions.SetSearchFilterMappingData(SurveySearchFilterMappingDataObj));
    this.store.dispatch(new fromSearchPageActions.SetSearchFeatureId(SearchFeatureIds.MultiMatch));
    this.store.dispatch(new fromSearchPageActions.SetUserFilterTypeData(SurveySearchUserFilterType));
    this.store.dispatch(new fromModifyPricingsActions.GetPricingsToModify(payload));
  }

  matchModalSaved() {
    this.store.dispatch(new fromPfDataGridActions.LoadData(this.pageViewId));
  }
}

