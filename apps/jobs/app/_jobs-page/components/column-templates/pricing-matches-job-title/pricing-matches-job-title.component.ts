import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked,
  HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges, OnChanges, EventEmitter, Output
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import isEmpty from 'lodash/isEmpty';

import { UpdatePricingMatchRequest, ViewField } from 'libs/models/payfactors-api';
import { PermissionService } from 'libs/core';
import { AsyncStateObj } from 'libs/models';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import { ApiServiceType } from 'libs/features/notes-manager/constants/api-service-type-constants';

import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import {UpsertPeerDataCutEntityConfigurationModel} from 'libs/features/upsert-peer-data-cut/models';
import {
  UpsertPeerDataCutEntities,
  UpsertPeerDataCutParentEntities
} from 'libs/features/upsert-peer-data-cut/constants';
import * as fromUpsertPeerActions from 'libs/features/upsert-peer-data-cut/actions';

import { PageViewIds } from '../../../constants';
import * as fromModifyPricingsActions from '../../../actions';
import * as fromModifyPricingsReducer from '../../../reducers';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss'],
})

export class PricingMatchesJobTitleComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {

  @Input() dataRow: any;
  @Input() pricingInfo: any;
  @Output() reScopeSurveyDataEmitter = new EventEmitter();

  @ViewChild('jobTitleText') jobTitleText: ElementRef;
  @ViewChild('detailsText') detailsText: ElementRef;
  @ViewChild('reScopeSurveyDataTemplate') reScopeSurveyDataTemplate: ElementRef<any>;

  permissions = Permissions;

  notesApiServiceType: ApiServiceType;
  pricingMatchIdForGridRefresh: number;

  jobsSelectedRow$: Observable<any>;

  isActiveJob = true;
  isActiveJobSubscription: Subscription;

  pricingMatchesDataSuscription: Subscription;
  pricingMatchesCount = 0;

  showDeletePricingMatchModal = new BehaviorSubject<boolean>(false);
  showDeletePricingMatchModal$ = this.showDeletePricingMatchModal.asObservable();

  deletingPricingMatch$: Observable<AsyncStateObj<boolean>>;
  getDeletingPricingMatchSuccessSubscription: Subscription;

  updateGridDataRowSubscription: Subscription;

  weight: number;
  adjustment: number;
  jobsGridJobStatusField: ViewField;
  jobsGridFieldSubscription: Subscription;

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

  previousPricingEffectiveDate: any = null;
  previousPricingEffectiveDateSubscription: Subscription;

  @HostListener('window:resize') windowResize() {
    this.ngAfterViewChecked();
  }

  constructor(
    public permissionService: PermissionService,
    private store: Store<fromModifyPricingsReducer.State>,
    private actionsSubject: ActionsSubject,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.jobsSelectedRow$ = this.store.select(fromPfDataGridReducer.getSelectedRow, PageViewIds.Jobs);

    this.canModifyPricings = this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single);
    this.hasPeerPermission = this.permissionService.CheckPermission([Permissions.PEER], PermissionCheckEnum.Single);

    const pricingMatchPageViewId = `${PageViewIds.PricingMatches}_${this.pricingInfo.CompanyJobs_Pricings_CompanyJobPricing_ID}`;
    this.pricingMatchesDataSuscription = this.store.select(fromPfDataGridReducer.getData, pricingMatchPageViewId).subscribe(data => {
      this.pricingMatchesCount = data?.total;
    });

    this.deletingPricingMatch$ = this.store.select(fromModifyPricingsReducer.getDeletingPricingMatch);
    this.getDeletingPricingMatchSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromModifyPricingsActions.DELETING_PRICING_MATCH_SUCCESS))
      .subscribe(data => {
        this.showDeletePricingMatchModal.next(false);
      });

    this.jobsGridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
        this.jobsGridJobStatusField = fields.find(f => f.SourceName === 'JobStatus');
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

    this.isActiveJobSubscription = this.store
      .select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
        // TODO: The JobStatus field filter can have a value of 'true' or true.
        // This is because of the way the active/inactive slider sets the filter value
        // This  quick fix needs to be converted to a more robust solution
        const statusFieldFilter: any = fields.find(f => f.SourceName === 'JobStatus').FilterValue;
        this.isActiveJob = statusFieldFilter === 'true' || statusFieldFilter === true;
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
            ExchangeDataCutId: data['payload']['UserJobMatchId'],
          };
          const pricingId = this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricing_ID'];
          const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

          this.store.dispatch(new fromModifyPricingsActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
        }
      });

    this.previousPricingEffectiveDateSubscription = this.store.select(fromModifyPricingsReducer.getPreviousPricingEffectiveDate)
      .subscribe(v => {
      if (v !== null) {
        this.previousPricingEffectiveDate = !v ? null : v;
        this.showDeletePricingMatchModal.next(true);
        this.store.dispatch(new fromModifyPricingsActions.ResetModifyPricingsModals());
  }
    });
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
    this.getDeletingPricingMatchSuccessSubscription.unsubscribe();
    this.updateGridDataRowSubscription.unsubscribe();
    this.pricingMatchesDataSuscription.unsubscribe();
    this.isActiveJobSubscription.unsubscribe();
    this.upsertPeerDataSubscription.unsubscribe();
    this.previousPricingEffectiveDateSubscription.unsubscribe();
  }


  checkOverflow(element) {
    // IE hack because IE calculates offsets differently
    const agent = window.navigator.userAgent.toLowerCase();
    const IEOffsetModifier = agent.indexOf('trident') > -1 || agent.indexOf('edge') > -1 ? 1 : 0.49;
    return element.getBoundingClientRect().width + IEOffsetModifier < element.scrollWidth;
  }

  openDeletePricingMatchModal() {
    if (this.pricingMatchesCount !== 1 || this.previousPricingEffectiveDate !==  null) {
    this.showDeletePricingMatchModal.next(true);
    this.store.dispatch(new fromModifyPricingsActions.ResetModifyPricingsModals());
    } else {
      this.getPreviousPricingEffectiveDate();
  }
  }

  deletePricingMatch(datarow: any) {
    if (this.pricingMatchesCount !== 1) {
      this.store.dispatch(new fromModifyPricingsActions.DeletingPricingMatch(
      datarow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID
    ));
    } else {
      this.store.dispatch(new fromModifyPricingsActions.DeletePricingAndMatch(
        datarow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID
      ));
  }

  }
  getPreviousPricingEffectiveDate() {
    const matchId = this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID;
    this.store.dispatch(new fromModifyPricingsActions.GetPreviousPricingEffectiveDate(matchId));
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
      !this.pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name'] &&
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

      this.reScopeSurveyDataEmitter.emit(data);
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
      !this.pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name'] &&
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
