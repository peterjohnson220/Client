import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked,
  HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges, OnChanges, EventEmitter, Output, TemplateRef
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { isEmpty } from 'lodash';

import { UpdatePricingMatchRequest, PricingUpdateStrategy } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { ReScopeSurveyDataModalConfiguration } from 'libs/features/re-scope-survey-data/models';
import { Permissions, PermissionCheckEnum } from 'libs/constants';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';
import * as fromPfDataGridActions from 'libs/features/pf-data-grid/actions';
import * as fromReScopeSurveyDataActions from 'libs/features/re-scope-survey-data/actions';

import { PageViewIds } from '../../../constants';
import * as fromJobsPageActions from '../../../actions';
import * as fromJobsPageReducer from '../../../reducers';
import { PermissionService } from 'libs/core';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss'],
})
export class PricingMatchesJobTitleComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  permissions = Permissions;
  permissionCheckEnum = PermissionCheckEnum;

  @Input() dataRow: any;
  @Input() pricingInfo: any;
  @Output() notesEmitter = new EventEmitter();

  @ViewChild('jobTitleText') jobTitleText: ElementRef;
  @ViewChild('detailsText') detailsText: ElementRef;
  @ViewChild('reScopeSurveyDataTemplate') reScopeSurveyDataTemplate: ElementRef<any>;

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

  public isCollapsed = true;
  public isOverflow = false;

  canModifyPricings: boolean;

  reScopeSurveyDataConfiguration: ReScopeSurveyDataModalConfiguration;
  reScopeSurveyDataSubscription: Subscription;
  showReScopeSurveyDataModal = new BehaviorSubject<boolean>(false);
  showReScopeSurveyDataModal$ = this.showReScopeSurveyDataModal.asObservable();

  @HostListener('window:resize') windowResize() {
    this.ngAfterViewChecked();
  }

  constructor(
    public permissionService: PermissionService,
    private store: Store<fromJobsPageReducer.State>,
    private actionsSubject: ActionsSubject,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.jobsSelectedRow$ = this.store.select(fromPfDataGridReducer.getSelectedRow, PageViewIds.Jobs);

    this.canModifyPricings = this.permissionService.CheckPermission([this.permissions.MODIFY_PRICINGS], this.permissionCheckEnum.Single);

    const pricingMatchPageViewId = `${PageViewIds.PricingMatches}_${this.pricingInfo.CompanyJobs_Pricings_CompanyJobPricing_ID}`;
    this.pricingMatchesDataSuscription = this.store.select(fromPfDataGridReducer.getData, pricingMatchPageViewId).subscribe(data => {
      this.pricingMatchesCount = data?.total;
    });

    this.deletingPricingMatch$ = this.store.select(fromJobsPageReducer.getDeletingPricingMatch);
    this.getDeletingPricingMatchSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobsPageActions.DELETING_PRICING_MATCH_SUCCESS))
      .subscribe(data => {
        this.showDeletePricingMatchModal.next(false);
      });

    // We need to update the pricingInfo manually because the state is not updated when the grid is updated using the UpdateGridDataRow action
    this.updateGridDataRowSubscription = this.actionsSubject
      .pipe(ofType(fromPfDataGridActions.UPDATE_GRID_DATA_ROW))
      .subscribe((action: fromPfDataGridActions.UpdateGridDataRow) => {
        const key = 'CompanyJobs_Pricings_CompanyJobPricing_ID';
        if (action.pageViewId === PageViewIds.PricingDetails && action.data[key] === this.pricingInfo[key]) {
          this.pricingInfo = action.data[key];
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

    this.reScopeSurveyDataSubscription = this.actionsSubject
      .pipe(ofType(fromReScopeSurveyDataActions.GET_RE_SCOPE_SURVEY_DATA_CONTEXT_SUCCESS))
      .subscribe(data => {
        if (data['payload'] && data['payload']['MatchId'] === this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID']) {
          this.showReScopeSurveyDataModal.next(true);
        }
      });

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
    this.reScopeSurveyDataSubscription.unsubscribe();
  }

  getScope(): string {
    return `${this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope1 ? ' - ' + this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope1 : ''}
    ${this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope2 ? ' - ' + this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope2 : ''}
    ${this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope3 ? ' - ' + this.dataRow.vw_PricingMatchesJobTitlesMerged_Scope3 : ''}`;
  }

  checkOverflow(element) {
    // IE hack because IE calculates offsets differently
    const agent = window.navigator.userAgent.toLowerCase();
    const IEOffsetModifier = agent.indexOf('trident') > -1 || agent.indexOf('edge') > -1 ? 1 : 0.49;
    return element.getBoundingClientRect().width + IEOffsetModifier < element.scrollWidth;
  }

  openDeletePricingMatchModal() {
    this.showDeletePricingMatchModal.next(true);
    this.store.dispatch(new fromJobsPageActions.ResetErrorsForModals());
  }

  deletePricingMatch(datarow: any) {
    this.store.dispatch(new fromJobsPageActions.DeletingPricingMatch(
      datarow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID
    ));
  }

  updatePricingMatch() {
    const request: UpdatePricingMatchRequest = {
      MatchId: this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID,
      MatchWeight: this.weight,
      MatchAdjustment: this.adjustment,
      SurveyDataId: null,
      PricingUpdateStrategy: PricingUpdateStrategy.Parent
    };
    const pricingId = this.dataRow.CompanyJobs_PricingsMatches_CompanyJobPricing_ID;
    const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

    this.store.dispatch(new fromJobsPageActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
  }

  openAddNotesModal() {
    const data = {
      EntityId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      DataRow: this.dataRow,
      Scope: this.getScope()
    };
    this.notesEmitter.emit(data);
  }

  openReScopeSurveyDataModal() {
    if (this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'] &&
      !this.pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name'] &&
      this.canModifyPricings
    ) {
      this.reScopeSurveyDataConfiguration = {
        ...this.reScopeSurveyDataConfiguration,
        SurveyJobId: this.dataRow['vw_PricingMatchesJobTitlesMerged_Survey_Job_ID'],
        SurveyDataId: this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'],
        SurveyJobTemplate: this.reScopeSurveyDataTemplate,
        Rate: this.pricingInfo['CompanyJobs_Pricings_Rate'],
        EntityId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID']
      };

      this.store.dispatch(new fromReScopeSurveyDataActions.GetReScopeSurveyDataContext(this.reScopeSurveyDataConfiguration.EntityId));
    }
  }

  reScopeSurveyDataCut(surveyDataId: number) {
    const request: UpdatePricingMatchRequest = {
      MatchId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      MatchWeight: null,
      MatchAdjustment: null,
      SurveyDataId: surveyDataId,
      PricingUpdateStrategy: PricingUpdateStrategy.ParentLinkedSlotted
    };
    const pricingId = this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricing_ID'];
    const matchesGridPageViewId = `${PageViewIds.PricingMatches}_${pricingId}`;

    this.store.dispatch(new fromJobsPageActions.UpdatingPricingMatch(request, pricingId, matchesGridPageViewId));
    this.showReScopeSurveyDataModal.next(false);
  }
}
