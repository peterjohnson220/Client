import { Component, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { Subscription, BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { SortDescriptor } from '@progress/kendo-data-query';
import cloneDeep from 'lodash/cloneDeep';

import { PfDataGridFilter, ActionBarConfig, getDefaultActionBarConfig } from 'libs/features/pf-data-grid/models';
import { PfDataGridColType } from 'libs/features/pf-data-grid/enums';
import { ReScopeSurveyDataModalConfiguration } from 'libs/features/re-scope-survey-data/models';
import { NotesEntities } from 'libs/features/notes-manager/constants';
import * as fromNotesManagerActions from 'libs/features/notes-manager/actions';
import * as fromPfGridActions from 'libs/features/pf-data-grid/actions';
import * as fromPfGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromReScopeActions from 'libs/features/re-scope-survey-data/actions';

import * as fromPricingDetailsActions from 'libs/features/pricing-details/actions';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';

import { ViewField } from 'libs/models/payfactors-api/reports/request';
import { AsyncStateObj } from 'libs/models';
import { PricingUpdateStrategy, UpdatePricingMatchRequest } from 'libs/models/payfactors-api';
import { NotesManagerConfiguration } from 'libs/models/notes';

import { PageViewIds } from '../../../../constants';
import { JobTitleCodePipe } from '../../../../pipes';

import * as fromJobsPageActions from '../../../../actions';
import * as fromJobsPageReducer from '../../../../reducers';

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

  inboundFiltersToApply = ['CompanyJob_ID', 'PayMarket', 'Status'];
  mrpFields = ['AllowMRP', 'BaseMRP', 'BonusMRP', 'BonusPctMRP', 'BonusTargetMRP', 'BonusTargetPctMRP', 'FixedMRP', 'LTIPMRP', 'LTIPPctMRP', 'RemunMRP',
    'SalesIncentiveActualMRP', 'SalesIncentiveActualPctMRP', 'SalesIncentiveTargetMRP', 'SalesIncentiveTargetPctMRP',
    'TargetLTIPMRP', 'TargetTDCMRP', 'TCCMRP', 'TCCPlusAllowMRP', 'TCCPlusAllowNoCarMRP', 'TCCTargetMRP', 'TCCTargetPlusAllowMRP',
    'TCCTargetPlusAllowNoCarMRP', 'TDCMRP', 'TGPMRP'];
  payMarketOptions: any;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyPayMarkets_PayMarket'
  }];
  selectedKeys: number[];
  actionBarConfig: ActionBarConfig;
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

  constructor(private store: Store<fromJobsPageReducer.State>, private actionsSubject: ActionsSubject) {
    this.jobTitleCodePipe = new JobTitleCodePipe();

    this.updatingPricingMatch$ = this.store
      .select(fromJobsPageReducer.getUpdatingPricingMatch)
      .pipe(switchMap(ev => ev.saving ? of(ev).debounceTime(2000) : of(ev)));

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

    this.getPricingReviewedSuccessSubscription = actionsSubject
      .pipe(ofType(fromPricingDetailsActions.SAVING_PRICING_SUCCESS))
      .subscribe(data => {
        this.store.dispatch(new fromPfDataGridActions.LoadData(PageViewIds.PricingDetails));
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
      ShowPricingWarning: true
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
    this.reScopeSurveyDataSubscription.unsubscribe();
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
      Rate: event.Rate
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
