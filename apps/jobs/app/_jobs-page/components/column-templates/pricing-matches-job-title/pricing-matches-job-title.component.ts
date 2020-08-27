import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked,

  HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges, OnChanges, EventEmitter, Output, TemplateRef
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { isEmpty } from 'lodash';


import { UpdatePricingMatchRequest, PricingUpdateStrategy, ViewField } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
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
  @Output() reScopeSurveyDataEmitter = new EventEmitter();

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

  reScopeSurveyDataJobDetailOpen = false;

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

      this.jobsGridFieldSubscription = this.store.select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
          this.jobsGridJobStatusField = fields.find(f => f.SourceName === 'JobStatus');
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

  reScopeSurveyData() {
    if (this.dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'] &&
      !this.pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name'] &&
      this.permissionService.CheckPermission([this.permissions.MODIFY_PRICINGS], this.permissionCheckEnum.Single)
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
}
