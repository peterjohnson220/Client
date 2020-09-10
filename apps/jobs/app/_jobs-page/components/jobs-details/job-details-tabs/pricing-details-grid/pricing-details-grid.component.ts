import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/pf-data-grid/models';
import { getDefaultPagingOptions, PagingOptions } from 'libs/models/payfactors-api/search/request';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { AbstractFeatureFlagService, FeatureFlags } from 'libs/core/services/feature-flags';

import { NotesManagerConfiguration } from 'libs/models/notes';
import { NotesEntities } from 'libs/features/notes-manager/constants';
import * as fromNotesManagerActions from 'libs/features/notes-manager/actions';

import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromJobsPageActions from '../../../../actions';
import * as fromJobsPageReducer from '../../../../reducers';
import { PageViewIds } from '../../../../constants';
import { JobTitleCodePipe } from '../../../../pipes';


@Component({
  selector: 'pf-pricing-details-grid',
  templateUrl: './pricing-details-grid.component.html',
  styleUrls: ['./pricing-details-grid.component.scss']
})
export class PricingDetailsGridComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() filters: PfDataGridFilter[];
  @Input() unPricedCount: number;
  @ViewChild('pricedDataPayMarketFilter') pricedDataPayMarketFilter: ElementRef;
  @ViewChild('changeView') changeView: ElementRef;
  @ViewChild('payMarketColumn') payMarketColumn: ElementRef;
  @ViewChild('agingColumn') agingColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('matchInfoColumn') matchInfoColumn: ElementRef;
  @ViewChild('genericMrpColumn') genericMrpColumn: ElementRef;
  @ViewChild('pricingNotesHeader') pricingNotesHeader: TemplateRef<any>;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket'];
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];
  payMarketOptions: any;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  defaultPagingOptions: PagingOptions;

  selectedKeys: number[];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;
  viewMode = 'Priced';
  companyPayMarketsSubscription: Subscription;

  pricedDataPageViewId = PageViewIds.PricingDetails;
  pricedDataGlobalFilterTemplates = {};
  pricedDataColTemplates = {};
  pricedDataGridFieldSubscription: Subscription;
  pricedDataPayMarketField: ViewField;
  pricedDataFilteredPayMarketOptions: any;
  pricedDataSelectedPayMarket: any;

  selectedPricingPayMarket: string;
  getNotesSuccessSubscription: Subscription;
  getAddingPricingMatchNoteSuccessSubscription: Subscription;
  showNotesManager = new BehaviorSubject<boolean>(false);
  showNotesManager$ = this.showNotesManager.asObservable();

  // This is needed to refresh the matches grid after adding a new note to increment count
  notesManagerPricingId: number;
  notesManagerConfiguration: NotesManagerConfiguration;
  selectedJobRow: any;
  selectedJobRowSubscription: Subscription;

  jobTitleCodePipe: JobTitleCodePipe;
  hasInfiniteScrollFeatureFlagEnabled: boolean;

  constructor(
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject,
    private featureFlagService: AbstractFeatureFlagService
  ) {
    this.hasInfiniteScrollFeatureFlagEnabled = this.featureFlagService.enabled(FeatureFlags.PfDataGridInfiniteScroll, false);
    this.jobTitleCodePipe = new JobTitleCodePipe();

    this.selectedJobRowSubscription = this.store.select(fromPfGridReducer.getSelectedRow, PageViewIds.Jobs).subscribe(row => {
      this.selectedJobRow = row;
    });

    this.companyPayMarketsSubscription = store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.pricedDataFilteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.pricedDataGridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pricedDataPageViewId).subscribe(fields => {
      if (fields) {
        this.pricedDataPayMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.pricedDataSelectedPayMarket = this.pricedDataPayMarketField.FilterValue !== null ?
          { Value: this.pricedDataPayMarketField.FilterValue, Id: this.pricedDataPayMarketField.FilterValue } : null;
      }
    });

    // We show the NotesModal only after the Notes have loaded. This way we ensure the modal height doesn't jump around but is dynamic
    this.getNotesSuccessSubscription = actionsSubject
      .pipe(ofType(fromNotesManagerActions.GET_NOTES_SUCCESS) || ofType(fromNotesManagerActions.GET_NOTES_ERROR))
      .subscribe(data => {
        this.showNotesManager.next(true);
      });

    this.getAddingPricingMatchNoteSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.ADD_NOTE_SUCCESS))
      .subscribe(data => {
        switch (data['payload']['Entity']) {
          case 'Pricing Matches':
            this.store.dispatch(new fromPfGridActions.LoadData(`${PageViewIds.PricingMatches}_${this.notesManagerPricingId}`));
            break;
        }

        this.showNotesManager.next(false);
      });

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: this.hasInfiniteScrollFeatureFlagEnabled,
      ScrollToTop: this.hasInfiniteScrollFeatureFlagEnabled,
      SelectAllPanelItemName: 'pricings'
    };
    this.defaultPagingOptions = this.hasInfiniteScrollFeatureFlagEnabled
      ? getDefaultPagingOptions()
      : { From: 0, Count: 20 };

    this.notesManagerConfiguration = {
      ModalTitle: 'Pricing Notes',
      ShowModal$: this.showNotesManager$,
      EnableAdd: false,
      NotesHeader: undefined,
      Entity: 'Pricings',
      EntityId: undefined,
      PlaceholderText: undefined
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.pricedDataPayMarketFilter
      },
      GlobalActionsTemplate: this.changeView
    };
    this.pricedDataGlobalFilterTemplates = {
      'PayMarket': { Template: this.pricedDataPayMarketFilter }
    };

    this.pricedDataColTemplates = {
      'PayMarket': { Template: this.payMarketColumn },
      'Aging_Factor': { Template: this.agingColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.pricingInfo]: { Template: this.matchInfoColumn }
    };

    this.mrpFields.forEach(mrp => {
      this.pricedDataColTemplates[mrp] = { Template: this.genericMrpColumn };
    });
  }

  ngOnDestroy() {
    this.companyPayMarketsSubscription.unsubscribe();
    this.pricedDataGridFieldSubscription.unsubscribe();
    this.getNotesSuccessSubscription.unsubscribe();
    this.getAddingPricingMatchNoteSuccessSubscription.unsubscribe();
    this.selectedJobRowSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filters']) {
      this.filters = cloneDeep(changes['filters'].currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);
    }
  }

  handleFilter(value) {
    this.pricedDataFilteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.pricedDataPayMarketField);
    field.FilterOperator = '=';
    field.FilterValue = value.Id;

    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pricedDataPageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pricedDataPageViewId, field));
    }
  }

  switchViewToNotPriced() {
    this.store.dispatch(new fromJobsPageActions.ChangePricingDetailsView('Not Priced'));
  }

  openPricingNotesManager(event: any, selectedPricing: any) {
    this.selectedPricingPayMarket = selectedPricing['CompanyPayMarkets_PayMarket'];
    this.notesManagerPricingId = selectedPricing['CompanyJobs_Pricings_CompanyJobPricing_ID'];
    this.notesManagerConfiguration = {
      ...this.notesManagerConfiguration,
      Entity: NotesEntities.Pricings,
      EntityId: selectedPricing['CompanyJobs_Pricings_CompanyJobPricing_ID'],
      EnableAdd: false,
      ModalTitle: `Pricing Notes -
        ${this.jobTitleCodePipe.transform(this.selectedJobRow,
        'CompanyJobs',
          'Job_Title',
        'Job_Code')}`,
      NotesHeader: this.pricingNotesHeader,
      PlaceholderText: undefined
    };

    event.stopPropagation();
  }

  openPricingMatchNotesManager(event: any) {
    this.notesManagerPricingId = event.ParentPricingId;
    this.notesManagerConfiguration = {
      ...this.notesManagerConfiguration,
      Entity: NotesEntities.PricingMatches,
      EntityId: event.Configuration.EntityId,
      EnableAdd: event.Configuration.EnableAdd,
      ModalTitle: event.Configuration.ModalTitle,
      NotesHeader: event.Configuration.NotesHeader,
      PlaceholderText: 'Please add any notes you would like to attach to this match.'
    };
  }
}
