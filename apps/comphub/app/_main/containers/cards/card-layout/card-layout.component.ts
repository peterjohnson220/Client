import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { WindowRef } from 'libs/core/services';
import { QuickPriceType } from 'libs/constants';

import { environment } from 'environments/environment';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { JobPricingLimitInfo, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent implements OnInit {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';
  @Input() hideBackButton: boolean;
  @Input() hideNextButton: boolean;
  @Input() nextButtonEnabled: boolean;
  @Input() backButtonEnabled: boolean;
  @Input() page: ComphubPages;
  @Input() failsDojGuidelines: boolean;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;
  jobPricingBlocked$: Observable<boolean>;
  workflowContext$: Observable<WorkflowContext>;
  selectedPageIdDelayed$: Observable<ComphubPages>;

  jobPricingLimitInfoSub: Subscription;
  workflowContextSub: Subscription;

  jobPricingLimitInfo: JobPricingLimitInfo;
  workflowContext: WorkflowContext;
  comphubPages = ComphubPages;
  quickPriceTypes = QuickPriceType;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private window: WindowRef,
    private modalService: NgbModal
  ) {
    this.jobPricingLimitInfo$ = this.store.select(fromComphubMainReducer.getJobPricingLimitInfo);
    this.jobPricingBlocked$ = this.store.select(fromComphubMainReducer.getJobPricingBlocked);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubMainReducer.getSelectedPageId).pipe(debounceTime(750));
  }

  get formattedLimit() {
    return `${this.jobPricingLimitInfo.Used} / ${this.jobPricingLimitInfo.Available}`;
  }

  ngOnInit(): void {
    this.jobPricingLimitInfoSub = this.jobPricingLimitInfo$.subscribe(jpli => this.jobPricingLimitInfo = jpli);
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);
  }

  handleNextButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleBackButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToPreviousCard());
  }

  handleCloseClicked() {
    this.modalService.open(this.modalContent, <NgbModalOptions> {
      backdrop: 'static'
    });
  }

  handleConfirmedCloseApp() {
    this.window.nativeWindow.location = `/${environment.hostPath}/dashboard`;
  }
}
