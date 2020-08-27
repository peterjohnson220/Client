import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked,
  HostListener, ChangeDetectorRef, OnDestroy, EventEmitter, Output
} from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ActionsSubject, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';

import { GridDataResult } from '@progress/kendo-angular-grid';

import isEmpty from 'lodash/isEmpty';

import { ViewField } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { Permissions } from 'libs/constants';
import * as fromPfDataGridReducer from 'libs/features/pf-data-grid/reducers';

import { PageViewIds } from '../../../constants';
import * as fromJobsPageActions from '../../../actions';
import * as fromJobsPageReducer from '../../../reducers';

@Component({
  selector: 'pf-pricing-matches-job-title',
  templateUrl: './pricing-matches-job-title.component.html',
  styleUrls: ['./pricing-matches-job-title.component.scss'],
})
export class PricingMatchesJobTitleComponent implements OnInit, AfterViewChecked, OnDestroy {
  permissions = Permissions;

  @Input() dataRow: any;
  @Input() pricingInfo: any;
  @Output() notesEmitter = new EventEmitter();

  @ViewChild('jobTitleText') jobTitleText: ElementRef;
  @ViewChild('detailsText') detailsText: ElementRef;

  jobsGridJobStatusField: ViewField;
  jobsGridFieldSubscription: Subscription;

  public isCollapsed = true;
  public isOverflow = false;

  showDeletePricingMatchModal = new BehaviorSubject<boolean>(false);
  showDeletePricingMatchModal$ = this.showDeletePricingMatchModal.asObservable();

  deletingPricingMatch$: Observable<AsyncStateObj<boolean>>;
  getDeletingPricingMatchSuccessSubscription: Subscription;

  pricingMatchesData$: Observable<GridDataResult>;
  jobsSelectedRow$: Observable<any>;

  @HostListener('window:resize') windowResize() {
    this.ngAfterViewChecked();
  }

  constructor(private store: Store<fromJobsPageReducer.State>, private actionsSubject: ActionsSubject, private cdRef: ChangeDetectorRef ) { }

  ngOnInit() {
    this.jobsSelectedRow$ = this.store.select(fromPfDataGridReducer.getSelectedRow, PageViewIds.Jobs);
    this.pricingMatchesData$ = this.store.select(
      fromPfDataGridReducer.getData,
      `${PageViewIds.PricingMatches}_${this.pricingInfo.CompanyJobs_Pricings_CompanyJobPricing_ID}`);

    this.deletingPricingMatch$ = this.store.select(fromJobsPageReducer.getDeletingPricingMatch);
    this.getDeletingPricingMatchSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobsPageActions.DELETING_PRICING_MATCH_SUCCESS))
      .subscribe(data => {
        this.showDeletePricingMatchModal.next(false);
      });

      this.jobsGridFieldSubscription = this.store
      .select(fromPfDataGridReducer.getFields, PageViewIds.Jobs)
      .pipe(filter(f => !isEmpty(f)))
      .subscribe(fields => {
          this.jobsGridJobStatusField = fields.find(f => f.SourceName === 'JobStatus');
      });
  }

  ngAfterViewChecked(): void {
    this.isOverflow = this.checkOverflow(this.jobTitleText.nativeElement) || this.checkOverflow(this.detailsText.nativeElement);
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.getDeletingPricingMatchSuccessSubscription.unsubscribe();
    this.jobsGridFieldSubscription.unsubscribe();
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

  openAddNotesModal() {
    const data = {
      EntityId: this.dataRow['CompanyJobs_PricingsMatches_CompanyJobPricingMatch_ID'],
      DataRow: this.dataRow,
      Scope: this.getScope()
    };
    this.notesEmitter.emit(data);
  }
}
