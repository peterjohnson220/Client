import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked,
  HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges, OnChanges
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import isEmpty from 'lodash/isEmpty';

import { UpdatePricingMatchRequest, ViewField } from 'libs/models/payfactors-api';
import { PermissionService } from 'libs/core';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import { ApiServiceType } from 'libs/features/notes/notes-manager/constants/api-service-type-constants';

import * as fromPfDataGridReducer from 'libs/features/grids/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/grids/pf-data-grid/actions';
import {UpsertPeerDataCutEntityConfigurationModel} from 'libs/features/pricings/upsert-peer-data-cut/models';
import {
  UpsertPeerDataCutEntities,
  UpsertPeerDataCutParentEntities
} from 'libs/features/pricings/upsert-peer-data-cut/constants';
import * as fromUpsertPeerActions from 'libs/features/pricings/upsert-peer-data-cut/actions';
import * as fromDataCutSummaryActions from 'libs/features/pricings/data-cut-summary/actions';
import { ReScopeSurveyDataModalConfiguration } from 'libs/features/surveys/re-scope-survey-data/models';
import * as fromReScopeActions from 'libs/features/surveys/re-scope-survey-data/actions';

import { PageViewIds } from '../../../constants';
import * as fromModifyPricingsActions from '../../../actions';
import * as fromModifyPricingsReducer from '../../../reducers';
import { DeleteMatchModalData } from '../../../models';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss'],
})

export class PricingMatchesJobTitleComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {

  @Input() dataRow: any;
  @Input() pricingInfo: any;

  @ViewChild('jobTitleText') jobTitleText: ElementRef;
  @ViewChild('detailsText') detailsText: ElementRef;
  @ViewChild('reScopeSurveyDataTemplate') reScopeSurveyDataTemplate: ElementRef;

  permissions = Permissions;

  notesApiServiceType: ApiServiceType;
  pricingMatchIdForGridRefresh: number;

  jobsSelectedRow$: Observable<any>;
  jobsSelectedRowSubscription: Subscription;
  jobsSelectedRow: any;

  isActiveJob = true;
  isActiveJobSubscription: Subscription;

  pricingMatchesDataSuscription: Subscription;
  pricingMatchesCount = 0;
  updateGridDataRowSubscription: Subscription;

  weight: number;
  adjustment: number;

  public isCollapsed = true;
  public isOverflow = false;

  canModifyPricings: boolean;
  hasPeerPermission: boolean;

  upsertPeerDataSubscription: Subscription;
  upsertPeerDataCutEntityConfiguration: UpsertPeerDataCutEntityConfigurationModel = {
    BaseEntity: UpsertPeerDataCutEntities.PricingMatches,
    BaseEntityId: null,
    ParentEntity: UpsertPeerDataCutParentEntities.Pricings,
    ParentEntityId: null
  };

  reScopeSurveyDataConfiguration: ReScopeSurveyDataModalConfiguration;


  // This is needed to refresh the matches grid after updating the scopes
  selectedPricingId: number;
  matchIdForUpdates: number;

  rescopeSubmissionSubscription: Subscription;
  rescopeCancellationSubscription: Subscription;

  isSelectedForRescope = false;

  @HostListener('window:resize') windowResize() {
    this.ngAfterViewChecked();
  }

  constructor(
    public permissionService: PermissionService,
    private store: Store<fromModifyPricingsReducer.State>,
    private actionsSubject: ActionsSubject,
    private cdRef: ChangeDetectorRef
    ) {
      this.jobsSelectedRow$ = this.store.select(fromPfDataGridReducer.getSelectedRow, PageViewIds.Jobs);
    }

  ngOnInit() {
    // this subscription is required for closing the modal of the currently clicked row. Otherwise, isSelectedForResocpe will be true for multiple rows.
    // That with throw ExpressionChangedAfterItHasBeenCheckedError. If we don't want this action we would need to pass dataRow and pricingInfo, but this would
    // couple pricing-matches-job-title to re-scope-survey-data...
    this.rescopeCancellationSubscription = this.actionsSubject.pipe(ofType(fromReScopeActions.RE_SCOPE_SURVEY_CANCEL))
      .subscribe(() => {
        if (this.isSelectedForRescope) {
          this.isSelectedForRescope = false;
        }
      });

    this.rescopeSubmissionSubscription = this.actionsSubject.pipe(ofType(fromReScopeActions.RE_SCOPE_SURVEY_SUBMIT))
      .subscribe((action: fromReScopeActions.ReScopeSurveySubmit) => {
        if (action.newSurveyDataId && this.isSelectedForRescope) {
          const request: UpdatePricingMatchRequest = {
            MatchId: this.matchIdForUpdates,
            MatchWeight: null,
            MatchAdjustment: null,
            SurveyDataId: action.newSurveyDataId,
            ExchangeDataCutId: null,
          };
          const pricingId = this.selectedPricingId;
          const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

          this.store.dispatch(new fromModifyPricingsActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));

          this.isSelectedForRescope = false;
        }
      });

    this.canModifyPricings = this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single);
    this.hasPeerPermission = this.permissionService.CheckPermission([Permissions.PEER], PermissionCheckEnum.Single);

    const pricingMatchPageViewId = `${PageViewIds.PricingMatches}_${this.pricingInfo.CompanyJobs_Pricings_CompanyJobPricing_ID}`;
    this.pricingMatchesDataSuscription = this.store.select(fromPfDataGridReducer.getData, pricingMatchPageViewId).subscribe(data => {
      this.pricingMatchesCount = data?.total;
    });

    // We need to update the pricingInfo manually because the state is not updated when the grid is updated using the UpdateGridDataRow action
    this.updateGridDataRowSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.UPDATE_GRID_DATA_ROW))
      .subscribe((action: fromPfDataGridActions.UpdateGridDataRow) => {
        const key = 'CompanyJobs_Pricings_CompanyJobPricing_ID';
        if (action.pageViewId === PageViewIds.PayMarkets && action.data[key] === this.pricingInfo[key]) {
          this.pricingInfo = action.data;
        }
      });

    this.jobsSelectedRowSubscription = this.jobsSelectedRow$.subscribe(data => this.jobsSelectedRow = data);

    this.isActiveJobSubscription = this.store
      .select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
        const statusFieldFilter: ViewField = fields.find(f => f.SourceName === 'JobStatus');
        this.isActiveJob = statusFieldFilter?.FilterValues?.length > 0
          ? statusFieldFilter.FilterValues[0] === 'true'
          : true;
      });

    this.upsertPeerDataSubscription = this.actionsSubject
      .pipe(ofType(fromUpsertPeerActions.UPSERT_DATA_CUT_SUCCESS))
      .subscribe(data => {
        if (data['payload']['BaseEntityId'] === this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID']) {
          const request: UpdatePricingMatchRequest = {
            MatchId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
            MatchWeight: null,
            MatchAdjustment: null,
            SurveyDataId: null,
            ExchangeDataCutId: data['payload']['MatchId'],
          };
          const pricingId = this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricing_ID'];
          const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

          this.store.dispatch(new fromModifyPricingsActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
          this.store.dispatch(new fromDataCutSummaryActions.RemoveDataCutSummary({dataCutKey: data['payload']['BaseEntityId'] + 'CompanyJobPricingMatchId'}));
        }
      });

    this.reScopeSurveyDataConfiguration = {
      SurveyJobId: undefined,
      SurveyDataId: undefined,
      SurveyJobTemplate: undefined,
      Rate: 'Annual',
      ShowPricingWarning: true,
      EntityId: undefined
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataRow && changes.dataRow.currentValue) {
      this.weight = changes.dataRow.currentValue.CompanyJobs_PricingsMatches_Match_Weight;
      this.adjustment = changes.dataRow.currentValue.CompanyJobs_PricingsMatches_Match_Adjustment;
    }
  }

  ngAfterViewChecked(): void {
    this.isOverflow = this.checkOverflow(this.jobTitleText.nativeElement) || this.checkOverflow(this.detailsText.nativeElement);
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.rescopeSubmissionSubscription.unsubscribe();
    this.updateGridDataRowSubscription.unsubscribe();
    this.pricingMatchesDataSuscription.unsubscribe();
    this.isActiveJobSubscription.unsubscribe();
    this.upsertPeerDataSubscription.unsubscribe();
    this.jobsSelectedRowSubscription.unsubscribe();
  }

  openReScopeSurveyDataModal(data: any) {
    this.reScopeSurveyDataConfiguration = {
      ...this.reScopeSurveyDataConfiguration,
      SurveyJobId: data.SurveyJobId,
      SurveyDataId: data.SurveyDataId,
      SurveyJobTemplate: data.SurveyJobTemplate,
      Rate: data.Rate,
      EntityId: data.MatchId
    };

    this.matchIdForUpdates = data.MatchId;
    this.selectedPricingId = data.PricingId;

    this.store.dispatch(new fromReScopeActions.GetReScopeSurveyDataContext(data.MatchId));
    this.isSelectedForRescope = true;
    this.cdRef.detectChanges(); // detect changes for the currently clicked row to avoid ExpressionChangedAfterItHasBeenCheckedError
  }

  checkOverflow(element) {
    // IE hack because IE calculates offsets differently
    const agent = window.navigator.userAgent.toLowerCase();
    const IEOffsetModifier = agent.indexOf('trident') > -1 || agent.indexOf('edge') > -1 ? 1 : 0.49;
    return element.getBoundingClientRect().width + IEOffsetModifier < element.scrollWidth;
  }

  openDeletePricingMatchModal(): void {
    const deleteModalData: DeleteMatchModalData = {
      PricingMatchId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      JobTitle: this.jobsSelectedRow['CompanyJobs_Job_Title'],
      JobCode: this.jobsSelectedRow['CompanyJobs_Job_Code'],
      JobId: this.pricingInfo['CompanyJobs_CompanyJob_ID'],
      MatchJobTitle: this.dataRow['vw_PricingMatchesJobTitlesMerged_Job_Title'],
      MatchJobCode: this.dataRow['vw_PricingMatchesJobTitlesMerged_Job_Code'],
      PayMarket: this.pricingInfo['CompanyPayMarkets_PayMarket'],
      PayMarketId: this.pricingInfo['CompanyPayMarkets_CompanyPayMarket_ID'],
      EffectiveDate: this.pricingInfo['CompanyJobs_Pricings_Effective_Date'],
      PricingMatchesCount: this.pricingMatchesCount
    };
    this.store.dispatch(new fromModifyPricingsActions.SetDeleteMatchModalData(deleteModalData));
  }

  handleMatchClick() {
    if (this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID']) {
      this.reScopeSurveyData();
    } else if (this.dataRow['ExchangeDataCut_FilterGUID']) {
      this.upsertPeerDataCut();
    }
  }

  updatePricingMatch() {
    const request: UpdatePricingMatchRequest = {
      MatchId: this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID,
      MatchWeight: this.weight,
      MatchAdjustment: this.adjustment,
      ExchangeDataCutId: null,
      SurveyDataId: null
    };
    const pricingId = this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricing_ID;
    const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

    this.store.dispatch(new fromModifyPricingsActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
  }

  reScopeSurveyData() {
    if (this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'] &&
      !this.pricingInfo['CompanyJobs_Pricings_Linked_PayMarket_Name'] &&
      this.canModifyPricings
    ) {
      const data = {
        SurveyJobId: this.dataRow['vw_PricingMatchesJobTitlesMerged_Survey_Job_ID'],
        SurveyDataId: this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'],
        SurveyJobTemplate: this.reScopeSurveyDataTemplate,
        Rate: this.pricingInfo['CompanyJobs_Pricings_Rate'],
        MatchId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
        PricingId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricing_ID']
      };

      this.openReScopeSurveyDataModal(data);
    }
  }

  reloadPricingMatches() {
    if (this.pricingMatchIdForGridRefresh) {
      const pricingId = this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricing_ID;
      this.store.dispatch(new fromPfDataGridActions.LoadData(`${PageViewIds.PricingMatches}_${pricingId}`));
    }
    this.closeNotesManager();
  }

  openNotesManager() {
    this.notesApiServiceType = ApiServiceType.PricingMatch;
    this.pricingMatchIdForGridRefresh = this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID;
  }

  closeNotesManager() {
    this.pricingMatchIdForGridRefresh = null;
    this.notesApiServiceType = null;
  }

  upsertPeerDataCut() {
    if (this.dataRow['ExchangeDataCut_FilterGUID'] &&
      !this.pricingInfo['CompanyJobs_Pricings_Linked_PayMarket_Name'] &&
      this.canModifyPricings && this.hasPeerPermission) {
      this.upsertPeerDataCutEntityConfiguration = {
        ...this.upsertPeerDataCutEntityConfiguration,
        BaseEntityId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
        ParentEntityId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricing_ID']
      };
    }
  }

  closeUpsertPeerCutModal() {
    this.upsertPeerDataCutEntityConfiguration = {
      ...this.upsertPeerDataCutEntityConfiguration,
      BaseEntityId: null,
      ParentEntityId: null
    };
  }
}
