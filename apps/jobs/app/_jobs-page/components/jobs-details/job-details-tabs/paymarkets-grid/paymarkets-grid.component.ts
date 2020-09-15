import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, TemplateRef, OnInit } from '@angular/core';
import { Subscription, BehaviorSubject, Observable, of, timer, EMPTY } from 'rxjs';
import { switchMap, debounce } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { NotesEntities } from 'libs/features/notes-manager/constants';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ReScopeSurveyDataModalConfiguration } from 'libs/features/re-scope-survey-data/models';

import { AsyncStateObj, NotesManagerConfiguration } from 'libs/models';
import { ViewField, UpdatePricingMatchRequest, PricingUpdateStrategy } from 'libs/models/payfactors-api';

import * as fromNotesManagerActions from 'libs/features/notes-manager/actions';
import * as fromReScopeActions from 'libs/features/re-scope-survey-data/actions';

import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';

import * as fromPricingDetailsActions from 'libs/features/pricing-details/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import * as fromJobsPageActions from '../../../../actions';
import * as fromJobsPageReducer from '../../../../reducers';

import { PageViewIds } from '../../../../constants';
import { JobTitleCodePipe } from '../../../../pipes';

@Component({
  selector: 'pf-paymarkets-grid',
  templateUrl: './paymarkets-grid.component.html',
  styleUrls: ['./paymarkets-grid.component.scss']
})
export class PaymarketsGridComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() filters: PfDataGridFilter[];

  @ViewChild('globalActions') globalActions: ElementRef;
  @ViewChild('priciedFilter') pricedFilter: ElementRef;
  @ViewChild('payMarketFilter') payMarketFilter: ElementRef;
  @ViewChild('payMarketColumn') payMarketColumn: ElementRef;
  @ViewChild('agingColumn') agingColumn: ElementRef;
  @ViewChild('currencyColumn') currencyColumn: ElementRef;
  @ViewChild('matchInfoColumn') matchInfoColumn: ElementRef;
  @ViewChild('genericMrpColumn') genericMrpColumn: ElementRef;
  @ViewChild('pricingNotesHeader') pricingNotesHeader: TemplateRef<any>;

  pageViewId = PageViewIds.PayMarkets;

  actionBarConfig: ActionBarConfig;

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket', 'Status', 'Priced'];
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];
  payMarketOptions: any;

  defaultSort: SortDescriptor[] = [{
    dir: 'desc',
    field: 'CompanyJobs_Pricings_Recency'
  }, {
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];

  allPayMarkets = { display: '', value: null };
  pricedPayMarkets = { display: 'Yes', value: 'notnull' };
  unpricedPayMarkets = { display: 'No', value: 'isnull' };

  bitFilterOptions = [this.allPayMarkets, this.pricedPayMarkets, this.unpricedPayMarkets];

  companyPayMarketsSubscription: Subscription;

  columnTemplates = {};
  gridFieldSubscription: Subscription;

  payMarketField: ViewField;
  filteredPayMarketOptions: any;
  selectedPayMarket: any;

  pricedField: ViewField;
  pricedFilterValue: any;

  selectedPricingPayMarket: string;
  getNotesSuccessSubscription: Subscription;
  getAddingPricingMatchNoteSuccessSubscription: Subscription;
  getPricingReviewedSuccessSubscription: Subscription;
  showNotesManager = new BehaviorSubject<boolean>(false);
  showNotesManager$ = this.showNotesManager.asObservable();

  updatingPricingMatch$: Observable<AsyncStateObj<boolean>>;

  // This is needed to refresh the matches grid after adding a new note to increment count
  selectedPricingId: number;
  notesManagerConfiguration: NotesManagerConfiguration;
  selectedJobRow: any;
  selectedJobRowSubscription: Subscription;

  jobTitleCodePipe: JobTitleCodePipe;

  showReScopeSurveyDataModal = new BehaviorSubject<boolean>(false);
  showReScopeSurveyDataModal$ = this.showReScopeSurveyDataModal.asObservable();
  reScopeSurveyDataSubscription: Subscription;
  reScopeSurveyDataConfiguration: ReScopeSurveyDataModalConfiguration;
  matchIdForReScope: number;

  noRecordsMessage: string;

  constructor(private store: Store<fromJobsPageReducer.State>, private actionsSubject: ActionsSubject) { }

  ngOnInit(): void {
    this.jobTitleCodePipe = new JobTitleCodePipe();

    this.updatingPricingMatch$ = this.store
      .select(fromJobsPageReducer.getUpdatingPricingMatch)
      .pipe(switchMap(ev => of(ev)))
      .pipe(debounce(ev => ev.saving ? timer(2000) : EMPTY));

    this.selectedJobRowSubscription = this.store.select(fromPfGridReducer.getSelectedRow, PageViewIds.Jobs).subscribe(row => {
      this.selectedJobRow = row;
    });

    this.companyPayMarketsSubscription = this.store.select(fromJobsPageReducer.getCompanyPayMarkets)
      .subscribe(o => {
        this.filteredPayMarketOptions = o;
        this.payMarketOptions = o;
      });

    this.gridFieldSubscription = this.store.select(fromPfGridReducer.getFields, this.pageViewId).subscribe(fields => {
      if (fields) {
        this.pricedField = fields.find(f => f.SourceName === 'CompanyJobPricing_ID');
        this.pricedFilterValue = this.bitFilterOptions.find(f => f.value === this.pricedField?.FilterOperator);

        this.payMarketField = fields.find(f => f.SourceName === 'PayMarket');
        this.selectedPayMarket = this.payMarketField.FilterValue !== null ?
          { Value: this.payMarketField.FilterValue, Id: this.payMarketField.FilterValue } : null;
      }
    });

    // We show the NotesModal only after the Notes have loaded. This way we ensure the modal height doesn't jump around but is dynamic
    this.getNotesSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.GET_NOTES_SUCCESS) || ofType(fromNotesManagerActions.GET_NOTES_ERROR))
      .subscribe(data => {
        this.showNotesManager.next(true);
      });

    this.getPricingReviewedSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromPricingDetailsActions.SAVING_PRICING_SUCCESS))
      .subscribe(data => {
        this.store.dispatch(new fromPfDataGridActions.LoadData(PageViewIds.PayMarkets));
      });

    this.getAddingPricingMatchNoteSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromNotesManagerActions.ADD_NOTE_SUCCESS))
      .subscribe(data => {
        switch (data['payload']['Entity']) {
          case 'Pricing Matches':
            this.store.dispatch(new fromPfGridActions.LoadData(`${PageViewIds.PricingMatches}_${this.selectedPricingId}`));
            break;
        }

        this.showNotesManager.next(false);
      });

    this.reScopeSurveyDataSubscription = this.actionsSubject
      .pipe(ofType(fromReScopeActions.GET_RE_SCOPE_SURVEY_DATA_CONTEXT_SUCCESS))
      .subscribe(data => {
        this.showReScopeSurveyDataModal.next(true);
      });

    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ActionBarClassName: 'ml-0 mr-3 mt-1'
    };

    this.notesManagerConfiguration = {
      ModalTitle: 'Pricing Notes',
      ShowModal$: this.showNotesManager$,
      EnableAdd: false,
      NotesHeader: undefined,
      Entity: 'Pricings',
      EntityId: undefined,
      PlaceholderText: undefined
    };

    this.reScopeSurveyDataConfiguration = {
      SurveyJobId: undefined,
      SurveyDataId: undefined,
      SurveyJobTemplate: undefined,
      ShowModal$: this.showReScopeSurveyDataModal$,
      Rate: 'Annual',
      ShowPricingWarning: true,
      EntityId: undefined
    };
  }

  ngAfterViewInit() {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalFiltersTemplates: {
        'PayMarket': this.payMarketFilter,
        'CompanyJobPricing_ID': this.pricedFilter
      },
      GlobalActionsTemplate: this.globalActions
    };

    this.columnTemplates = {
      'PayMarket': { Template: this.payMarketColumn },
      'Aging_Factor': { Template: this.agingColumn },
      [PfDataGridColType.currency]: { Template: this.currencyColumn },
      [PfDataGridColType.pricingInfo]: { Template: this.matchInfoColumn }
    };

    this.mrpFields.forEach(mrp => {
      this.columnTemplates[mrp] = { Template: this.genericMrpColumn };
    });
  }

  ngOnDestroy() {
    this.companyPayMarketsSubscription.unsubscribe();
    this.gridFieldSubscription.unsubscribe();
    this.getNotesSuccessSubscription.unsubscribe();
    this.getAddingPricingMatchNoteSuccessSubscription.unsubscribe();
    this.getPricingReviewedSuccessSubscription.unsubscribe();
    this.selectedJobRowSubscription.unsubscribe();
    this.reScopeSurveyDataSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filters) {
      this.filters = cloneDeep(changes.filters.currentValue)
        .filter(f => this.inboundFiltersToApply.indexOf(f.SourceName) > -1);

      this.noRecordsMessage = this.filters.find(x => x.SourceName === 'Status')
        ? 'There is no pricing for the filter criteria you have selected.'
        : 'No Pay Markets priced for this job. Click "Pay Markets not Priced" above to view and select Pay Markets to price.';

      const pricedInboundFilter = this.filters.find(f => f.SourceName === 'Priced');
      if (pricedInboundFilter) {
        pricedInboundFilter.SourceName = 'CompanyJobPricing_ID';
        pricedInboundFilter.Operator = pricedInboundFilter.Value === 'true' ? 'notnull' : 'isnull';
        pricedInboundFilter.Value = '';
      }
    }
  }

  customSortOptions = (previousSortDescriptor: SortDescriptor[], currentSortDescriptor: SortDescriptor[]): SortDescriptor[] => {
    if (previousSortDescriptor.length > 1 && currentSortDescriptor && currentSortDescriptor[0].field === 'CompanyPayMarkets_PayMarket') {
      return [{
        dir: 'asc',
        field: currentSortDescriptor[0].field
      }];
    } else {
      return currentSortDescriptor;
    }

  }

  handlePayMarketDropDownFilterChanged(value) {
    this.filteredPayMarketOptions = this.payMarketOptions.filter((s) => s.Id.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  handlePayMarketFilterChanged(value: any) {
    const field = cloneDeep(this.payMarketField);
    field.FilterOperator = '=';
    field.FilterValue = value.Id;

    this.updateField(field);
  }

  handlePricedFilterChanged(value: any) {
    const field = cloneDeep(this.pricedField);
    field.FilterOperator = this.pricedFilterValue.value;

    this.updateField(field);
  }

  updateField(field) {
    if (field.FilterValue || field.FilterOperator) {
      this.store.dispatch(new fromPfGridActions.UpdateFilter(this.pageViewId, field));
    } else {
      this.store.dispatch(new fromPfGridActions.ClearFilter(this.pageViewId, field));
    }
  }

  openPricingNotesManager(event: any, selectedPricing: any) {
    this.selectedPricingPayMarket = selectedPricing['CompanyPayMarkets_PayMarket'];
    this.selectedPricingId = selectedPricing['CompanyJobs_Pricings_CompanyJobPricing_ID'];
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
    this.selectedPricingId = event.ParentPricingId;
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

  openReScopeSurveyDataModal(event: any) {
    this.reScopeSurveyDataConfiguration = {
      ...this.reScopeSurveyDataConfiguration,
      SurveyJobId: event.SurveyJobId,
      SurveyDataId: event.SurveyDataId,
      SurveyJobTemplate: event.SurveyJobTemplate,
      Rate: event.Rate,
      EntityId: event.MatchId
    };

    this.matchIdForReScope = event.MatchId;
    this.selectedPricingId = event.PricingId;

    this.store.dispatch(new fromReScopeActions.GetReScopeSurveyDataContext(event.MatchId));
  }

  reScopeSurveyDataCut(surveyDataId: number) {
    const request: UpdatePricingMatchRequest = {
      MatchId: this.matchIdForReScope,
      MatchWeight: null,
      MatchAdjustment: null,
      SurveyDataId: surveyDataId,
      PricingUpdateStrategy: PricingUpdateStrategy.ParentLinkedSlotted
    };
    const pricingId = this.selectedPricingId;
    const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

    this.store.dispatch(new fromJobsPageActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
    this.showReScopeSurveyDataModal.next(false);
  }

}
